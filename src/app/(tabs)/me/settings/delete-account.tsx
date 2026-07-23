import { cn } from '@/utils/cn';
import { AppScreenHeader } from '@/components/settings/AppScreenHeader';
import { Text } from '@/components/ui/text';
import { useUserProfileMutations } from '@/hooks/api/useUserProfileMutations';
import { useDialog } from '@/hooks/useDialog';
import { AUTH0_CUSTOM_SCHEME } from '@/providers/auth0';
import { useGuest } from '@/providers/guest';
import { useClearAppQueryCache } from '@/providers/query';
import { useUniwind } from 'uniwind';
import { useTranslate } from '@tolgee/react';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const { deleteAccount } = useUserProfileMutations();
  const { confirmDestructive, dialog } = useDialog();
  const { clearSession } = useAuth0();
  const { clearGuest } = useGuest();
  const clearAppQueryCache = useClearAppQueryCache();
  const [deleting, setDeleting] = useState(false);
  const { t } = useTranslate();

  const handleDelete = async () => {
    const confirmed = await confirmDestructive({
      title: t('delete_account_title'),
      message: t('delete_account_confirm_message'),
      confirmLabel: t('delete_account_button'),
      cancelLabel: t('cancel'),
    });
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteAccount.mutateAsync();
      await clearSession({}, { customScheme: AUTH0_CUSTOM_SCHEME });
      await clearGuest();
      clearAppQueryCache();
      router.replace('/login');
    } catch {
      Alert.alert(t('edit_profile_save_failed'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AppScreenHeader title={t('delete_account_button')} />
      <ScrollView
        contentContainerClassName="px-6 pt-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <Text className="text-base leading-6">{t('delete_account_description')}</Text>
        <Pressable
          onPress={handleDelete}
          disabled={deleting}
          className={cn(
            'mt-10 h-[52px] items-center justify-center rounded-full active:opacity-80',
            isDark ? 'bg-white' : 'bg-black',
          )}
        >
          {deleting ? (
            <ActivityIndicator color={isDark ? '#000' : '#fff'} />
          ) : (
            <Text className={cn('text-base', isDark ? 'text-black' : 'text-white')}>
              {t('delete_account_button')}
            </Text>
          )}
        </Pressable>
      </ScrollView>
      {dialog}
    </View>
  );
}
