import { AppScreenHeader } from '@/components/settings/AppScreenHeader';
import { NotificationSwitchTile } from '@/components/settings/NotificationSwitchTile';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { useTranslate } from '@tolgee/react';
import { useUiLanguage } from '@/lib/i18n';
import { ActivityIndicator, Alert, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const { t } = useTranslate();
  const uiLanguage = useUiLanguage();
  const insets = useSafeAreaInsets();
  const isBo = uiLanguage === 'bo';
  const titleSize = isBo ? 20 : 16;
  const subtitleSize = isBo ? 17 : 13.5;

  const {
    loaded,
    master,
    routine,
    recitation,
    hasPermission,
    updateMaster,
    updateRoutine,
    updateRecitation,
    openBatterySettings,
  } = useNotificationSettings();

  if (!loaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const masterSubtitle = !master
    ? t('notification_allow_subtitle_disabled')
    : hasPermission
      ? t('notification_allow_subtitle_enabled')
      : t('notification_allow_subtitle_disabled');

  return (
    <View className="flex-1 bg-background">
      <AppScreenHeader title={t('notification_settings')} />
      <ScrollView
        contentContainerClassName="px-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <NotificationSwitchTile
          title={t('notification_allow_title')}
          subtitle={masterSubtitle}
          value={master}
          onValueChange={updateMaster}
          titleSize={titleSize}
          subtitleSize={subtitleSize}
        />

        {master && hasPermission ? (
          <>
            <NotificationSwitchTile
              title={t('notification_routine_title')}
              subtitle={
                routine
                  ? t('notification_routine_subtitle_enabled')
                  : t('notification_routine_subtitle_disabled')
              }
              value={routine}
              onValueChange={updateRoutine}
              titleSize={titleSize}
              subtitleSize={subtitleSize}
            />
            <NotificationSwitchTile
              title={t('notification_recitation_title')}
              subtitle={
                recitation
                  ? t('notification_recitation_subtitle_enabled')
                  : t('notification_recitation_subtitle_disabled')
              }
              value={recitation}
              onValueChange={updateRecitation}
              titleSize={titleSize}
              subtitleSize={subtitleSize}
            />
            {Platform.OS === 'android' ? (
              <NotificationSwitchTile
                title={t('notification_battery_title')}
                subtitle={t('notification_battery_subtitle_disabled')}
                value={false}
                onValueChange={() => openBatterySettings()}
                titleSize={titleSize}
                subtitleSize={subtitleSize}
                onInfo={() =>
                  Alert.alert(
                    t('notification_battery_info_title'),
                    t('notification_battery_info_body'),
                  )
                }
              />
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
