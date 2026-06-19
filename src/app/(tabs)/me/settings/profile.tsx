import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { AppScreenHeader } from '@/components/settings/AppScreenHeader';
import { ProfileAvatarSection } from '@/components/settings/ProfileAvatarSection';
import { UsernameFormField } from '@/components/settings/UsernameFormField';
import type { UsernameFieldState } from '@/components/settings/UsernameFormField';
import { FloatingTextInput } from '@/components/ui/floating-text-input';
import { Text } from '@/components/ui/text';
import { QUERY_KEYS } from '@/constants/query-keys';
import { Camera, CaretRight, Images, Trash } from '@/constants/settings-icons';
import { useUserProfile } from '@/hooks/api/useUserProfile';
import { useUserProfileMutations } from '@/hooks/api/useUserProfileMutations';
import { useNavigateOnce } from '@/hooks/useNavigateOnce';
import { useThemeColors } from '@/hooks/useThemeColors';
import { pickProfileImage } from '@/lib/image-picker';
import {
  emptyProfileFormState,
  profileToFormState,
  type ProfileFormState,
} from '@/lib/profile-form-state';
import { resolveProfileAvatarUrl } from '@/lib/profile-display';
import {
  validatePersonName,
  validateUsername,
  type UsernameValidationKey,
} from '@/lib/username-validation';
import type { UserProfile } from '@/types/user';
import { useQueryClient } from '@tanstack/react-query';
import { type Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from 'react-native';
import { useAuth0, type User } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

const BIO_MAX = 100;
const USERNAME_DEBOUNCE_MS = 700;

function seedFromAuth0(form: ProfileFormState, authUser: User | null | undefined): ProfileFormState {
  if (!authUser) return form;
  if (form.firstName || form.lastName) return form;

  let firstName = authUser.givenName ?? '';
  let lastName = authUser.familyName ?? '';

  if (!firstName && !lastName && authUser.name) {
    const parts = authUser.name.trim().split(/\s+/);
    firstName = parts[0] ?? '';
    lastName = parts.slice(1).join(' ');
  }

  return { ...form, firstName, lastName };
}

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const { foreground, mutedForeground, destructive } = useThemeColors();
  const { user: authUser } = useAuth0();
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryData<UserProfile>(QUERY_KEYS.profile.info());
  const initialForm = cachedProfile
    ? seedFromAuth0(profileToFormState(cachedProfile), authUser)
    : emptyProfileFormState();

  const {
    data: profile,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useUserProfile();
  const { updateProfile, patchUsername, uploadAvatar } = useUserProfileMutations();
  const navigateOnce = useNavigateOnce();

  const [username, setUsername] = useState(initialForm.username);
  const [firstName, setFirstName] = useState(initialForm.firstName);
  const [lastName, setLastName] = useState(initialForm.lastName);
  const [bio, setBio] = useState(initialForm.bio);
  const [originalUsername, setOriginalUsername] = useState(initialForm.originalUsername);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialForm.avatarUrl);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [usernameState, setUsernameState] = useState<UsernameFieldState>('idle');
  const [usernameMessageKey, setUsernameMessageKey] = useState<UsernameValidationKey>(null);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarSheetVisible, setAvatarSheetVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      setIsRefreshing(true);
      void refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (!profile || !isRefreshing) return;

    const next = seedFromAuth0(profileToFormState(profile), authUser);
    setUsername(next.username);
    setOriginalUsername(next.originalUsername);
    setFirstName(next.firstName);
    setLastName(next.lastName);
    setBio(next.bio);
    setAvatarUrl(next.avatarUrl);
    setIsRefreshing(false);
  }, [profile, isRefreshing, authUser]);

  const checkUsernameAvailability = useCallback(
    async (value: string) => {
      const validationKey = validateUsername(value);
      if (validationKey) {
        setUsernameState('idle');
        setUsernameMessageKey(validationKey);
        setUsernameSuggestions([]);
        return;
      }
      if (value.toLowerCase() === originalUsername.toLowerCase()) {
        setUsernameState('idle');
        setUsernameMessageKey(null);
        setUsernameSuggestions([]);
        return;
      }
      setUsernameState('checking');
      setUsernameMessageKey(null);
      setUsernameSuggestions([]);
      try {
        const result = await patchUsername.mutateAsync(value.toLowerCase());
        if (result.ok) {
          setUsernameState('available');
          setOriginalUsername(result.username);
        } else {
          setUsernameState('taken');
          setUsernameSuggestions(result.suggestions);
        }
      } catch {
        setUsernameState('error');
        setUsernameMessageKey(null);
      }
    },
    [originalUsername, patchUsername],
  );

  const onUsernameChange = (value: string) => {
    setUsername(value);
    const validationKey = validateUsername(value);
    setUsernameMessageKey(validationKey);
    setUsernameState('idle');
    setUsernameSuggestions([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!validationKey && value.toLowerCase() !== originalUsername.toLowerCase()) {
      debounceRef.current = setTimeout(() => checkUsernameAvailability(value), USERNAME_DEBOUNCE_MS);
    }
  };

  const pickAvatar = async (source: 'library' | 'camera') => {
    setAvatarSheetVisible(false);
    const uri = await pickProfileImage(source);
    if (!uri) {
      Alert.alert(t('profile.photo_upload_failed'));
      return;
    }
    setLocalAvatarUri(uri);
  };

  const canSave =
    !isRefreshing &&
    !saving &&
    !uploadingAvatar &&
    usernameState !== 'checking' &&
    usernameState !== 'taken' &&
    !validateUsername(username) &&
    !validatePersonName(firstName) &&
    !validatePersonName(lastName);

  const handleSave = async () => {
    const usernameError = validateUsername(username);
    const firstError = validatePersonName(firstName);
    const lastError = validatePersonName(lastName);
    setUsernameMessageKey(usernameError);
    setFirstNameError(firstError);
    setLastNameError(lastError);
    if (usernameError || firstError || lastError || usernameState === 'taken') return;

    setSaving(true);
    try {
      let nextAvatarUrl = avatarUrl;
      if (localAvatarUri) {
        setUploadingAvatar(true);
        try {
          nextAvatarUrl = await uploadAvatar.mutateAsync({
            uri: localAvatarUri,
            mimeType: 'image/jpeg',
          });
          setAvatarUrl(nextAvatarUrl);
          setLocalAvatarUri(null);
        } catch {
          Alert.alert(t('profile.photo_upload_failed'));
          return;
        } finally {
          setUploadingAvatar(false);
        }
      }
      if (username.toLowerCase() !== originalUsername.toLowerCase() && usernameState !== 'available') {
        const result = await patchUsername.mutateAsync(username.toLowerCase());
        if (!result.ok) {
          setUsernameState('taken');
          setUsernameSuggestions(result.suggestions);
          return;
        }
        setOriginalUsername(result.username);
      }
      await updateProfile.mutateAsync({
        firstname: firstName.trim(),
        lastname: lastName.trim(),
        educations: profile?.educations ?? [],
        social_profiles: profile?.social_profiles ?? [],
        about_me: bio.trim() || null,
        avatar_url: nextAvatarUrl,
      });
      await refetch();
      router.back();
    } catch {
      Alert.alert(t('profile.save_failed'));
    } finally {
      setSaving(false);
    }
  };

  const savePill = (
    <Pressable
      onPress={handleSave}
      disabled={!canSave}
      className="rounded-full px-5 py-2 active:opacity-80"
      style={{
        backgroundColor: canSave ? (isDark ? '#fdfdfc' : '#000') : isDark ? '#555' : '#d4d4d4',
      }}
    >
      <Text
        className="text-sm font-semibold"
        style={{ color: canSave ? (isDark ? '#000' : '#fff') : mutedForeground }}
      >
        {saving ? t('editRoutine.saving') : t('profile.save')}
      </Text>
    </Pressable>
  );

  if (isError && !profile) {
    return (
      <View className="flex-1 bg-background">
        <AppScreenHeader title={t('profile.edit_title')} />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-base" style={{ color: mutedForeground }}>
            {t('practice.routine_load_error')}
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-4 rounded-full px-6 py-3 active:opacity-80"
            style={{ backgroundColor: isDark ? '#fdfdfc' : '#000' }}
          >
            <Text className="text-sm font-semibold" style={{ color: isDark ? '#000' : '#fff' }}>
              {t('practice.retry')}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!profile && (isLoading || isFetching)) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const displayAvatar =
    localAvatarUri ?? resolveProfileAvatarUrl(profile, authUser) ?? avatarUrl;

  return (
    <View className="flex-1 bg-background">
      <AppScreenHeader title={t('profile.edit_title')} rightAction={savePill} />
      {(saving || uploadingAvatar || isRefreshing) && (
        <View className="bg-muted h-0.5 w-full">
          <ActivityIndicator style={{ height: 2 }} />
        </View>
      )}
      <ScrollView
        contentContainerClassName="px-6 pt-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <ProfileAvatarSection
          url={displayAvatar}
          isUploading={uploadingAvatar}
          onEditTap={() => setAvatarSheetVisible(true)}
        />

        <View className="mt-8">
          <UsernameFormField
            value={username}
            onChangeText={onUsernameChange}
            state={usernameState}
            validationKey={usernameMessageKey ?? undefined}
            suggestions={usernameSuggestions}
            onSuggestionTap={(s) => onUsernameChange(s)}
          />
        </View>

        <View className="mt-5 flex-row gap-3">
          <View className="flex-1">
            <FloatingTextInput
              label={t('profile.first_name')}
              value={firstName}
              onChangeText={setFirstName}
              error={firstNameError ? t(`profile.${firstNameError}`) : null}
            />
          </View>
          <View className="flex-1">
            <FloatingTextInput
              label={t('profile.last_name')}
              value={lastName}
              onChangeText={setLastName}
              error={lastNameError ? t(`profile.${lastNameError}`) : null}
            />
          </View>
        </View>

        <View className="mt-5">
          <FloatingTextInput
            label={t('profile.bio')}
            hint={t('profile.bio_hint')}
            value={bio}
            onChangeText={setBio}
            multiline
            minHeight={96}
            maxLength={BIO_MAX}
          />
          <Text className="text-muted-foreground mt-1 text-right text-xs">
            {bio.length}/{BIO_MAX}
          </Text>
        </View>

        <Pressable
          onPress={() => navigateOnce('/me/settings/delete-account' as Href)}
          className="mt-8 flex-row items-center py-3 active:opacity-70"
        >
          <Trash size={22} color={destructive} />
          <Text className="ml-3 flex-1 text-base" style={{ color: destructive }}>
            {t('profile.delete_account')}
          </Text>
          <CaretRight size={20} color={mutedForeground} />
        </Pressable>
      </ScrollView>

      <AppBottomSheet visible={avatarSheetVisible} onClose={() => setAvatarSheetVisible(false)}>
        <Pressable
          onPress={() => pickAvatar('library')}
          className="flex-row items-center px-6 py-4 active:opacity-70"
        >
          <Images size={24} color={foreground} />
          <Text className="ml-4 text-base">{t('profile.choose_from_library')}</Text>
        </Pressable>
        <Pressable
          onPress={() => pickAvatar('camera')}
          className="flex-row items-center px-6 py-4 active:opacity-70"
        >
          <Camera size={24} color={foreground} />
          <Text className="ml-4 text-base">{t('profile.take_photo')}</Text>
        </Pressable>
      </AppBottomSheet>
    </View>
  );
}
