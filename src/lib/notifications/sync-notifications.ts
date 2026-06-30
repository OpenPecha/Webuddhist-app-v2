import { QUERY_KEYS } from '@/constants/query-keys';
import type { SyncTrigger } from '@/lib/notifications/desired-notification';
import {
  areNotificationsEnabled,
  cancelAllOwnedNotifications,
} from '@/lib/notifications/notification-service';
import { runNotificationSyncEngine } from '@/lib/notifications/notification-sync-engine';
import {
  clearAllPlanMetadata,
  getPlanMetadata,
} from '@/lib/notifications/plan-metadata-store';
import { clearAllSpecialPlanData } from '@/lib/notifications/special-plan-started-at-store';
import { getCachedPlanAsUserPlan, syncPlanMetadataMirror } from '@/lib/notifications/sync-metadata';
import { StorageKeys, getBoolean } from '@/lib/storage';
import { fetchUserPlans } from '@/services/plans';
import type { RoutineData } from '@/types/routine';
import type { UserPlan } from '@/types/plans';
import type { QueryClient } from '@tanstack/react-query';

let inFlight: Promise<void> | null = null;
let queued = false;

async function readToggles(): Promise<{
  masterOn: boolean;
  routineOn: boolean;
  recitationOn: boolean;
}> {
  const [master, routine, recitation] = await Promise.all([
    getBoolean(StorageKeys.notificationMasterEnabled),
    getBoolean(StorageKeys.notificationRoutineEnabled),
    getBoolean(StorageKeys.notificationRecitationEnabled),
  ]);
  return {
    masterOn: master ?? true,
    routineOn: routine ?? true,
    recitationOn: recitation ?? true,
  };
}

export interface TriggerNotificationSyncOptions {
  trigger: SyncTrigger;
  queryClient: QueryClient;
  language: string;
  loggedIn: boolean;
  isGuest: boolean;
  routine?: RoutineData | null;
  plans?: UserPlan[] | null;
  routineLoadFailed?: boolean;
}

async function resolveRoutine(
  queryClient: QueryClient,
  override?: RoutineData | null,
): Promise<RoutineData | null> {
  if (override !== undefined) return override;
  return queryClient.getQueryData<RoutineData | null>(QUERY_KEYS.routine.user(0, 20)) ?? null;
}

async function resolvePlans(
  language: string,
  override?: UserPlan[] | null,
): Promise<{ plansById: Record<string, UserPlan> | null; plans: UserPlan[] }> {
  if (override) {
    return {
      plans: override,
      plansById: Object.fromEntries(override.map((plan) => [plan.id, plan])),
    };
  }
  try {
    const response = await fetchUserPlans(language, 0, 50);
    return {
      plans: response.plans,
      plansById: Object.fromEntries(response.plans.map((plan) => [plan.id, plan])),
    };
  } catch {
    return { plans: [], plansById: null };
  }
}

async function executeSync(options: TriggerNotificationSyncOptions): Promise<void> {
  const { trigger, queryClient, language, loggedIn, isGuest } = options;
  const effectiveLoggedIn = loggedIn && !isGuest;

  if (trigger === 'loggedOut') {
    await cancelAllOwnedNotifications();
    await clearAllPlanMetadata();
    await clearAllSpecialPlanData();
    return;
  }

  const toggles = await readToggles();
  const osGranted = await areNotificationsEnabled();
  const routine = await resolveRoutine(queryClient, options.routine);
  const { plans, plansById } = await resolvePlans(language, options.plans);

  if (effectiveLoggedIn && plans.length > 0) {
    await syncPlanMetadataMirror({ plans, routine, language });
  }

  await runNotificationSyncEngine(trigger, {
    loggedIn: effectiveLoggedIn,
    masterOn: toggles.masterOn,
    routineOn: toggles.routineOn,
    recitationOn: toggles.recitationOn,
    osGranted,
    routine,
    routineLoadFailed: options.routineLoadFailed ?? false,
    plansById: effectiveLoggedIn && toggles.masterOn && osGranted ? plansById : null,
    fetchSeriesPlans: async (seriesId) => {
      try {
        const response = await fetchUserPlans(language, 0, 50, seriesId);
        return response.plans;
      } catch {
        return [];
      }
    },
    getCachedPlanMetadata: async (planId, title) => {
      const metadata = await getPlanMetadata(planId);
      if (!metadata) return null;
      return getCachedPlanAsUserPlan(planId, title);
    },
  });
}

export async function triggerNotificationSync(
  options: TriggerNotificationSyncOptions,
): Promise<void> {
  if (inFlight) {
    queued = true;
    return inFlight;
  }

  inFlight = (async () => {
    try {
      await executeSync(options);
      while (queued) {
        queued = false;
        await executeSync(options);
      }
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
