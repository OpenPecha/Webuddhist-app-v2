import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  daysSinceEnrollment,
  isSpecialPlan,
  notificationContentForPlan,
} from '@/constants/special-plan-notifications';
import { StorageKeys, getBoolean, setBoolean } from '@/lib/storage';
import type { UserPlan } from '@/types/plans';
import { getEffectiveStartDate } from '@/utils/plan-utils';

/** Matches Flutter `NotificationChannels.routineBlockId`. */
export const ROUTINE_BLOCK_CHANNEL_ID = 'routine_block_reminder';

let configured = false;

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function specialPlanShownKey(planId: string, date: Date): string {
  return `${StorageKeys.specialPlanDay1ShownPrefix}${planId}_${formatDateKey(date)}`;
}

function planImmediateShownKey(planId: string, date: Date): string {
  return `${StorageKeys.planImmediateShownPrefix}${planId}_${formatDateKey(date)}`;
}

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

async function wasShownToday(key: string): Promise<boolean> {
  return (await getBoolean(key)) === true;
}

async function markShownToday(key: string): Promise<void> {
  await setBoolean(key, true);
}

async function showImmediateNotification(
  id: number,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    identifier: String(id),
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null,
  });
}

/**
 * Stub sync on app launch — mirrors Flutter `notificationSyncEngine.sync(appLaunch)`
 * for special-plan Day-1 catch-up and enrolled plan reminders.
 */
export async function syncPlanNotificationsOnLaunch(
  plans: UserPlan[],
  permissionGranted: boolean,
): Promise<void> {
  if (!permissionGranted || plans.length === 0) return;

  const today = new Date();

  for (const plan of plans) {
    const daysSince = daysSinceEnrollment(getEffectiveStartDate(plan).toISOString(), today);
    const dayNumber = daysSince + 1;

    if (isSpecialPlan(plan.id)) {
      const shownKey = specialPlanShownKey(plan.id, today);
      if (await wasShownToday(shownKey)) continue;

      const content = notificationContentForPlan(plan.id, dayNumber);
      if (!content) continue;

      await showImmediateNotification(
        hashPlanNotificationId(plan.id, dayNumber),
        content.title,
        content.body,
        { planId: plan.id, day: String(dayNumber) },
      );
      await markShownToday(shownKey);
      continue;
    }

    const shownKey = planImmediateShownKey(plan.id, today);
    if (await wasShownToday(shownKey)) continue;

    if (dayNumber > plan.total_days) continue;

    await showImmediateNotification(
      hashPlanNotificationId(plan.id, dayNumber),
      plan.title,
      `Day ${dayNumber} of ${plan.total_days} — continue your practice today.`,
      { planId: plan.id, day: String(dayNumber) },
    );
    await markShownToday(shownKey);
  }
}

function hashPlanNotificationId(planId: string, dayNumber: number): number {
  let hash = dayNumber;
  for (let i = 0; i < planId.length; i++) {
    hash = (hash * 31 + planId.charCodeAt(i)) % 1_000_000;
  }
  return hash;
}
