import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { ProfileAvatar } from '@/components/settings/ProfileAvatar';
import { Gear } from '@/constants/settings-icons';
import { Text } from '@/components/ui/text';
import { useUserProfile } from '@/hooks/api/useUserProfile';
import { useNavigateOnce } from '@/hooks/useNavigateOnce';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGuest } from '@/providers/guest';
import { type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MeScreen() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth0();
  const { isGuest } = useGuest();
  const { foreground, mutedForeground } = useThemeColors();
  const insets = useSafeAreaInsets();
  const navigateOnce = useNavigateOnce();
  const showGuest = !user || isGuest;
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  const avatarUrl = profile?.avatar_url ?? user?.picture ?? null;
  const displayName = profile?.username || user?.name || '';
  const bio = profile?.about_me ?? '';

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="min-h-12 flex-row items-center justify-between px-4 pb-2">
        <Text className="text-2xl font-bold">{t('nav.me')}</Text>
        <Pressable
          onPress={() => {
            const href = '/me/settings/' as Href;
            navigateOnce(href);
          }}
          className="h-10 w-10 items-center justify-center active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('settings.title')}
        >
          <Gear size={24} color={foreground} />
        </Pressable>
      </View>

      {showGuest ? (
        <View className="flex-1 justify-center px-8 pb-16">
          <View className="items-center">
            <ProfileAvatar size={104} />
            <Text className="mt-5 text-center text-[34px] font-bold leading-tight">
              {t('me.guest_headline')}
            </Text>
            <Text className="mt-3 text-center text-base" style={{ color: mutedForeground }}>
              {t('me.guest_subtitle')}
            </Text>
            <View className="mt-10 w-full">
              {authLoading ? (
                <ActivityIndicator size="large" className="py-6" />
              ) : (
                <SocialLoginButtons />
              )}
            </View>
          </View>
        </View>
      ) : (
        <View className="items-center px-8 pt-10">
          {profileLoading && !profile ? (
            <ProfileAvatar size={104} loading />
          ) : (
            <ProfileAvatar url={avatarUrl} size={104} />
          )}
          {displayName ? (
            <Text className="mt-4 text-[22px] font-semibold">{displayName}</Text>
          ) : null}
          {bio ? (
            <Text
              className="mt-2 px-8 text-center text-sm"
              style={{ color: mutedForeground }}
            >
              {bio}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}
