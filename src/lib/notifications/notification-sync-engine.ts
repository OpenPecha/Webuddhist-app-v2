import { isSpecialPlan } from '@/constants/special-plan-notifications';
import type { DesiredNotification, NotificationSyncReport, SyncTrigger } from '@/lib/notifications/desired-notification';
import {
  applyGlobalCap,
  computeForPlanBlock,
  computeForRecitationBlock,
  computeForSeriesBlock,
} from '@/lib/notifications/notification-compute';
import { DIAGNOSTIC_TEST_NOTIFICATION_ID, isOurNotificationId } from '@/lib/notifications/notification-id-scheme';
import {
  cancelNotificationId,
  getOwnedPendingIds,
  scheduleDesiredNotification,
} from '@/lib/notifications/notification-service';
import {
  clearPlanSeriesScheduledMarker,
  markPlanImmediateShownOn,
  markPlanSeriesScheduledOn,
  seriesScheduledIdsOn,
  wasPlanImmediateShownOn,
} from '@/lib/notifications/plan-metadata-store';
import { startOfDay } from '@/lib/notifications/routine-block-utils';
import { isSeriesRoutineItem } from '@/lib/notifications/series-plan-schedule';
import {
  markSpecialPlanShownOn,
  wasSpecialPlanShownOn,
} from '@/lib/notifications/special-plan-started-at-store';
import type { RoutineBlock, RoutineData, RoutineItem } from '@/types/routine';
import type { UserPlan } from '@/types/plans';

export interface NotificationSyncInput {
  loggedIn: boolean;
  masterOn: boolean;
  routineOn: boolean;
  recitationOn: boolean;
  osGranted: boolean;
  routine: RoutineData | null;
  routineLoadFailed?: boolean;
  plansById: Record<string, UserPlan> | null;
  fetchSeriesPlans: (seriesId: string) => Promise<UserPlan[]>;
  getCachedPlanMetadata: (planId: string, title: string) => Promise<UserPlan | null>;
}

function isPlanLikeItem(item: RoutineItem): boolean {
  return item.type === 'plan' || item.type === 'series';
}

function synthesizePlanFromMetadata(item: RoutineItem, metadata: UserPlan): UserPlan {
  return {
    ...metadata,
    id: item.id,
    title: item.title,
  };
}

async function fireImmediate(
  desired: DesiredNotification,
): Promise<boolean> {
  const item = desired.sourceItem;
  if (!item) return false;

  const today = startOfDay(new Date());
  const planId = desired.enrollmentPlanId ?? item.id;
  const isSpecial = isSpecialPlan(planId);

  if (isSpecial) {
    if (await wasSpecialPlanShownOn(planId, today)) return false;
  } else if (await wasPlanImmediateShownOn(planId, today)) {
    return false;
  }

  const ok = await scheduleDesiredNotification(desired);
  if (!ok) return false;

  if (isSpecial) {
    await markSpecialPlanShownOn(planId, today);
  } else {
    await markPlanImmediateShownOn(planId, today);
  }
  return true;
}

export async function runNotificationSyncEngine(
  trigger: SyncTrigger,
  input: NotificationSyncInput,
): Promise<NotificationSyncReport> {
  const started = Date.now();
  let scheduled = 0;
  let cancelled = 0;
  let skipped = 0;

  if (input.routineLoadFailed) {
    return { scheduled, cancelled, skipped, durationMs: Date.now() - started };
  }

  const now = new Date();
  const today = startOfDay(now);
  const todayMarkerByPlan = await seriesScheduledIdsOn(today);
  const scheduledRoutineItemIds = new Set(todayMarkerByPlan.values());
  const todayMarkerIds = new Map<number, string>();
  for (const [notificationId, routineItemId] of todayMarkerByPlan.entries()) {
    todayMarkerIds.set(notificationId, routineItemId);
  }

  const mightSchedule = input.loggedIn && input.masterOn && input.osGranted;
  const plansResolved = !mightSchedule || input.plansById != null;
  const plansById = input.plansById ?? {};
  const routineBlocks = input.routine?.blocks ?? [];

  const desired = new Map<number, DesiredNotification>();
  const seriesPlansCache = new Map<string, UserPlan[]>();

  async function seriesPlansFor(seriesId: string): Promise<UserPlan[]> {
    const cached = seriesPlansCache.get(seriesId);
    if (cached) return cached;
    const fetched = await input.fetchSeriesPlans(seriesId);
    seriesPlansCache.set(seriesId, fetched);
    return fetched;
  }

  if (!input.loggedIn || !input.masterOn || !input.osGranted) {
    // desired stays empty → cancel all owned
  } else {
    for (const block of routineBlocks) {
      if (block.items.length === 0 || !block.notificationEnabled) continue;

      const hasRecitation = block.items.some((item) => item.type === 'recitation');
      if (hasRecitation) {
        for (const entry of computeForRecitationBlock(block, now, {
          masterOn: input.masterOn,
          recitationOn: input.recitationOn,
        })) {
          desired.set(entry.id, entry);
        }
      }

      for (const item of block.items.filter(isPlanLikeItem)) {
        const isSeriesItem = isSeriesRoutineItem(item.id, plansById);
        if (isSeriesItem) {
          let seriesPlans = await seriesPlansFor(item.id);
          if (seriesPlans.length === 0 && item.currentPlanId && plansById[item.currentPlanId]) {
            seriesPlans = [plansById[item.currentPlanId]];
          }
          if (seriesPlans.length === 0 && !plansResolved) {
            const cachedPlanId = item.currentPlanId ?? null;
            if (cachedPlanId) {
              const cached = await input.getCachedPlanMetadata(
                cachedPlanId,
                item.currentPlanTitle ?? item.title,
              );
              if (cached) seriesPlans = [cached];
            }
          }
          if (seriesPlans.length === 0) continue;

          for (const entry of computeForSeriesBlock(block, item, seriesPlans, now, {
            masterOn: input.masterOn,
            routineOn: input.routineOn,
            seriesScheduledTodayByOS: scheduledRoutineItemIds.has(item.id),
          })) {
            desired.set(entry.id, entry);
          }
          continue;
        }

        let plan = plansById[item.id] ?? null;
        if (!plan && !plansResolved) {
          const cached = await input.getCachedPlanMetadata(item.id, item.title);
          if (cached) plan = synthesizePlanFromMetadata(item, cached);
        }
        if (!plan) continue;

        for (const entry of computeForPlanBlock(block, item, plan, now, {
          masterOn: input.masterOn,
          routineOn: input.routineOn,
          seriesScheduledTodayByOS: scheduledRoutineItemIds.has(item.id),
        })) {
          desired.set(entry.id, entry);
        }
      }
    }
  }

  applyGlobalCap(desired);

  const ownedPending = await getOwnedPendingIds();
  const canCancel = plansResolved || !input.loggedIn || !input.masterOn || !input.osGranted;

  for (const id of ownedPending) {
    if (id === DIAGNOSTIC_TEST_NOTIFICATION_ID) continue;
    if (desired.has(id)) continue;
    if (!canCancel) {
      skipped++;
      continue;
    }
    await cancelNotificationId(id);
    cancelled++;
    const markerPlanId = todayMarkerIds.get(id);
    if (markerPlanId) {
      await clearPlanSeriesScheduledMarker(markerPlanId);
    }
  }

  for (const entry of desired.values()) {
    if (entry.isImmediate) {
      const fired = await fireImmediate(entry);
      if (fired) scheduled++;
      else skipped++;
      continue;
    }

    const ok = await scheduleDesiredNotification(entry);
    if (ok) {
      scheduled++;
      if (
        !entry.isDailyRepeat &&
        entry.sourceItem &&
        entry.fireAt &&
        startOfDay(entry.fireAt).getTime() === today.getTime()
      ) {
        await markPlanSeriesScheduledOn(entry.sourceItem.id, today, entry.id);
      }
    } else {
      skipped++;
    }
  }

  return {
    scheduled,
    cancelled,
    skipped,
    durationMs: Date.now() - started,
  };
}
