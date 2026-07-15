import { AppScreenHeader } from '@/components/settings/AppScreenHeader';
import { NotificationSwitchTile } from '@/components/settings/NotificationSwitchTile';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const isBo = i18n.language === 'bo';
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
    ? t('notifications.allow_subtitle_disabled')
    : hasPermission
      ? t('notifications.allow_subtitle_enabled')
      : t('notifications.allow_subtitle_disabled');

  return (
    <View className="flex-1 bg-background">
      <AppScreenHeader title={t('notifications.settings_title')} />
      <ScrollView
        contentContainerClassName="px-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <NotificationSwitchTile
          title={t('notifications.allow_title')}
          subtitle={masterSubtitle}
          value={master}
          onValueChange={updateMaster}
          titleSize={titleSize}
          subtitleSize={subtitleSize}
        />

        {master && hasPermission ? (
          <>
            <NotificationSwitchTile
              title={t('notifications.routine_title')}
              subtitle={
                routine
                  ? t('notifications.routine_subtitle_enabled')
                  : t('notifications.routine_subtitle_disabled')
              }
              value={routine}
              onValueChange={updateRoutine}
              titleSize={titleSize}
              subtitleSize={subtitleSize}
            />
            <NotificationSwitchTile
              title={t('notifications.recitation_title')}
              subtitle={
                recitation
                  ? t('notifications.recitation_subtitle_enabled')
                  : t('notifications.recitation_subtitle_disabled')
              }
              value={recitation}
              onValueChange={updateRecitation}
              titleSize={titleSize}
              subtitleSize={subtitleSize}
            />
            {Platform.OS === 'android' ? (
              <NotificationSwitchTile
                title={t('notifications.battery_title')}
                subtitle={t('notifications.battery_subtitle_disabled')}
                value={false}
                onValueChange={() => openBatterySettings()}
                titleSize={titleSize}
                subtitleSize={subtitleSize}
                onInfo={() =>
                  Alert.alert(
                    t('notifications.battery_info_title'),
                    t('notifications.battery_info_body'),
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
