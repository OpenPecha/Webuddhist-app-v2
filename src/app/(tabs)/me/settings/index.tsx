import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { AppScreenHeader } from '@/components/settings/AppScreenHeader';
import { AppToggleSwitch } from '@/components/settings/AppToggleSwitch';
import {
  currentLanguageLabel,
  LanguagePickerSheet,
} from '@/components/settings/LanguagePickerSheet';
import { LogoutAlertDialog } from '@/components/settings/LogoutAlertDialog';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { SettingsSectionHeader } from '@/components/settings/SettingsSectionHeader';
import { Text } from '@/components/ui/text';
import {
  BellRinging,
  ChatText,
  Gavel,
  Globe,
  Info,
  Moon,
  SignIn,
  SignOut,
  Sun,
  User,
} from '@/constants/settings-icons';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useNavigateOnce } from '@/hooks/useNavigateOnce';
import { getAppVersionLabel } from '@/lib/app-version';
import { AUTH0_CUSTOM_SCHEME } from '@/providers/auth0';
import { useGuest } from '@/providers/guest';
import { useClearAppQueryCache } from '@/providers/query';
import { useThemeMode } from '@/providers/theme';
import { type Href, router } from 'expo-router';
import { useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { useUiLanguage } from '@/lib/i18n';
import { Linking, ScrollView, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FEEDBACK_URL = 'https://app-webuddhist.ideas.userback.io/p/5omSMHB8A9VMUrD6vLrE';

export default function SettingsScreen() {
  const { t } = useTranslate();
  const uiLanguage = useUiLanguage();
  const { user, clearSession } = useAuth0();
  const { isGuest, clearGuest } = useGuest();
  const { isDark, toggleDarkLight } = useThemeMode();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const navigateOnce = useNavigateOnce();
  const [languageSheetVisible, setLanguageSheetVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const clearAppQueryCache = useClearAppQueryCache();
  const insets = useSafeAreaInsets();

  const isAuthenticated = !!user && !isGuest;
  const versionLabel = getAppVersionLabel();

  const handleLogout = async () => {
    setLogoutVisible(false);
    try {
      await clearSession({}, { customScheme: AUTH0_CUSTOM_SCHEME });
      await clearGuest();
      clearAppQueryCache();
      router.replace('/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AppScreenHeader title={t('nav_settings')} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <SettingsSectionHeader title={t('settings_section_personalisation')} />
        <View className="mt-3">
          {isAuthenticated ? (
            <SettingsRow
              icon={User}
              title={t('settings_edit_profile')}
              onPress={() => navigateOnce('/me/settings/profile' as Href)}
            />
          ) : null}
          <SettingsRow
            icon={Globe}
            title={currentLanguageLabel(uiLanguage)}
            onPress={() => setLanguageSheetVisible(true)}
          />
          <SettingsRow
            icon={BellRinging}
            title={t('settings_notification_row')}
            onPress={() => navigateOnce('/me/settings/notifications' as Href)}
          />
          <SettingsRow
            icon={isDark ? Moon : Sun}
            title={t('settings_theme')}
            onPress={() => toggleDarkLight()}
            trailing={<AppToggleSwitch value={isDark} onValueChange={() => toggleDarkLight()} />}
          />
        </View>

        <View className="mt-6">
          <SettingsSectionHeader title={t('settings_section_more')} />
          <View className="mt-3">
            <SettingsRow
              icon={Info}
              title={t('about_title')}
              onPress={() => navigateOnce('/me/settings/about' as Href)}
            />
            <SettingsRow
              icon={Gavel}
              title={t('legal_title')}
              onPress={() => navigateOnce('/me/settings/legal' as Href)}
            />
            <SettingsRow
              icon={ChatText}
              title={t('settings_feedback_row')}
              trailingIcon="external"
              onPress={() => Linking.openURL(FEEDBACK_URL)}
            />
          </View>
        </View>

        <View className="mt-6">
          <SettingsSectionHeader title={t('settings_section_account')} />
          <View className="mt-3">
            {!isAuthenticated ? (
              <SettingsRow icon={SignIn} title={t('sign_in')} onPress={showLoginDrawer} />
            ) : (
              <SettingsRow
                icon={SignOut}
                title={t('logout')}
                destructive
                onPress={() => setLogoutVisible(true)}
              />
            )}
          </View>
        </View>

        {versionLabel ? (
          <Text className="text-muted-foreground mt-8 text-center text-sm">{versionLabel}</Text>
        ) : null}
      </ScrollView>

      <LanguagePickerSheet
        visible={languageSheetVisible}
        onClose={() => setLanguageSheetVisible(false)}
      />
      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
      <LogoutAlertDialog
        visible={logoutVisible}
        title={t('logout')}
        message={t('logout_confirmation')}
        cancelLabel={t('cancel')}
        confirmLabel={t('logout')}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
      />
    </View>
  );
}
