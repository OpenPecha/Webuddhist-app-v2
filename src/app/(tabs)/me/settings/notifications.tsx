import { AppScreenHeader } from '@/components/settings/AppScreenHeader';
import { NotificationSwitchTile } from '@/components/settings/NotificationSwitchTile';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { useAppLanguage } from '@/lib/tolgee';
import { ActivityIndicator, Alert, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const language = useAppLanguage();
  const insets = useSafeAreaInsets();
  const isBo = language === 'bo';
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
    ? "Permission needed. Tap to grant in Settings."
    : hasPermission
      ? "Notifications are enabled for this app"
      : "Permission needed. Tap to grant in Settings.";

  return (
    <View className="flex-1 bg-background">
      <AppScreenHeader title={"Notification settings"} />
      <ScrollView
        contentContainerClassName="px-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <NotificationSwitchTile
          title={"Allow notifications"}
          subtitle={masterSubtitle}
          value={master}
          onValueChange={updateMaster}
          titleSize={titleSize}
          subtitleSize={subtitleSize}
        />

        {master && hasPermission ? (
          <>
            <NotificationSwitchTile
              title={"Routine reminders"}
              subtitle={
                routine
                  ? "Daily reminders for your practice blocks"
                  : "Routine reminders are paused. Tap to resume."
              }
              value={routine}
              onValueChange={updateRoutine}
              titleSize={titleSize}
              subtitleSize={subtitleSize}
            />
            <NotificationSwitchTile
              title={"Recitations reminder"}
              subtitle={
                recitation
                  ? "Daily reminders for your recitations"
                  : "Recitation reminders are paused. Tap to resume."
              }
              value={recitation}
              onValueChange={updateRecitation}
              titleSize={titleSize}
              subtitleSize={subtitleSize}
            />
            {Platform.OS === 'android' ? (
              <NotificationSwitchTile
                title={"Background reminders"}
                subtitle={"Some Android phones pause background apps to save battery, which can delay or skip your reminders. Tap to keep yours running."}
                value={false}
                onValueChange={() => openBatterySettings()}
                titleSize={titleSize}
                subtitleSize={subtitleSize}
                onInfo={() =>
                  Alert.alert(
                    "About background reminders",
                    "Some Android phones pause background apps to save battery, which can delay or cancel your scheduled reminders. Exempting the app keeps your reminders reliably on time.",
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
