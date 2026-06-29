import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { DesiredNotification } from '@/lib/notifications/desired-notification';
import { isOurNotificationId } from '@/lib/notifications/notification-id-scheme';

/** Matches Flutter `NotificationChannels.routineBlockId`. */
export const ROUTINE_BLOCK_CHANNEL_ID = 'routine_block_reminder';

let configured = false;

export function configureNotificationHandler(): void {
  if (configured) return;
  configured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function ensureNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(ROUTINE_BLOCK_CHANNEL_ID, {
    name: 'Routine Block Reminder',
    description: 'Daily notifications for routine practice blocks',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    enableVibrate: true,
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  await ensureNotificationChannels();

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function areNotificationsEnabled(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDesiredNotification(desired: DesiredNotification): Promise<boolean> {
  const content = {
    title: desired.title,
    body: desired.body,
    data: desired.payload ? { payload: desired.payload } : undefined,
    sound: true,
    ...(Platform.OS === 'android' ? { channelId: ROUTINE_BLOCK_CHANNEL_ID } : {}),
  };

  if (desired.isImmediate || !desired.fireAt) {
    await Notifications.scheduleNotificationAsync({
      identifier: String(desired.id),
      content,
      trigger: null,
    });
    return true;
  }

  if (desired.isDailyRepeat) {
    await Notifications.scheduleNotificationAsync({
      identifier: String(desired.id),
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: desired.fireAt.getHours(),
        minute: desired.fireAt.getMinutes(),
      },
    });
    return true;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: String(desired.id),
    content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: desired.fireAt,
    },
  });
  return true;
}

export async function cancelNotificationId(id: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(String(id));
}

export async function cancelAllOwnedNotifications(): Promise<void> {
  const pending = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    pending
      .map((request) => Number(request.identifier))
      .filter((id) => Number.isFinite(id) && isOurNotificationId(id))
      .map((id) => Notifications.cancelScheduledNotificationAsync(String(id))),
  );
}

export async function getOwnedPendingIds(): Promise<number[]> {
  const pending = await Notifications.getAllScheduledNotificationsAsync();
  return pending
    .map((request) => Number(request.identifier))
    .filter((id) => Number.isFinite(id) && isOurNotificationId(id));
}
