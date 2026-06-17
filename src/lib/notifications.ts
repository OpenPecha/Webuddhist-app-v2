import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/** Matches Flutter `NotificationChannels.routineBlockId`. */
export const ROUTINE_BLOCK_CHANNEL_ID = 'routine_block_reminder';

let configured = false;

/** Foreground notification presentation — call once at app startup. */
export function configureNotificationHandler(): void {
  if (configured) return;
  configured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/** Android channel setup — mirrors Flutter routine block channel (sound added later). */
export async function ensureNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(ROUTINE_BLOCK_CHANNEL_ID, {
    name: 'Routine Block Reminder',
    description: 'Daily notifications for routine practice blocks',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    enableVibrate: true,
    sound: 'default',
  });
}

/** Request OS notification permission. Returns whether notifications may be shown. */
export async function requestNotificationPermissions(): Promise<boolean> {
  await ensureNotificationChannels();

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}
