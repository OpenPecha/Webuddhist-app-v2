import { isSpecialPlan } from '@/constants/special-plan-notifications';
import {
  clearPlanEnrollmentMetadata,
  getAllCachedPlanIds,
  getPlanMetadata,
  setPlanMetadata,
} from '@/lib/notifications/plan-metadata-store';
import {
  clearSpecialPlanStartedAtOnly,
  setSpecialPlanStartedAt,
} from '@/lib/notifications/special-plan-started-at-store';
import { isSeriesRoutineItem } from '@/lib/notifications/series-plan-schedule';
import type { RoutineBlock, RoutineData, RoutineItem } from '@/types/routine';
import type { UserPlan } from '@/types/plans';
import { getEffectiveStartDate } from '@/utils/plan-utils';
import { fetchUserPlans } from '@/services/plans';

function isPlanLikeItem(item: RoutineItem): boolean {
  return item.type === 'plan' || item.type === 'series';
}

async function fetchPlansForSeries(seriesId: string, language: string): Promise<UserPlan[]> {
  try {
    const response = await fetchUserPlans(language, 0, 50, seriesId);
    return response.plans;
  } catch {
    return [];
  }
}

async function collectLinkedPlanIds(
  plansById: Record<string, UserPlan>,
  routineBlocks: RoutineBlock[],
  language: string,
): Promise<Set<string>> {
  const linked = new Set<string>();
  const seriesIds = new Set<string>();

  for (const block of routineBlocks) {
    for (const item of block.items.filter(isPlanLikeItem)) {
      if (isSeriesRoutineItem(item.id, plansById)) {
        seriesIds.add(item.id);
      } else {
        linked.add(item.id);
      }
    }
  }

  for (const seriesId of seriesIds) {
    const seriesPlans = await fetchPlansForSeries(seriesId, language);
    for (const plan of seriesPlans) linked.add(plan.id);
  }

  return linked;
}

export async function syncPlanMetadataMirror(options: {
  plans: UserPlan[];
  routine: RoutineData | null;
  language: string;
}): Promise<void> {
  const { plans, routine, language } = options;
  const plansById = Object.fromEntries(plans.map((plan) => [plan.id, plan]));
  const routineBlocks = routine?.blocks ?? [];
  const linkedPlanIds = await collectLinkedPlanIds(plansById, routineBlocks, language);
  const enrolledIds = new Set(plans.map((plan) => plan.id));

  const cachedIds = await getAllCachedPlanIds();
  for (const cachedId of cachedIds) {
    if (enrolledIds.has(cachedId)) continue;
    await clearPlanEnrollmentMetadata(cachedId);
    if (isSpecialPlan(cachedId)) {
      await clearSpecialPlanStartedAtOnly(cachedId);
    }
  }

  for (const plan of plans) {
    if (!linkedPlanIds.has(plan.id)) {
      if (isSpecialPlan(plan.id)) {
        await clearSpecialPlanStartedAtOnly(plan.id);
      }
      await clearPlanEnrollmentMetadata(plan.id);
      continue;
    }

    const anchor = getEffectiveStartDate(plan);
    await setPlanMetadata(plan.id, anchor, plan.total_days);
    if (isSpecialPlan(plan.id)) {
      await setSpecialPlanStartedAt(plan.id, anchor);
    }
  }
}

export async function getCachedPlanAsUserPlan(planId: string, title: string): Promise<UserPlan | null> {
  const metadata = await getPlanMetadata(planId);
  if (!metadata) return null;
  return {
    id: planId,
    title,
    description: '',
    language: '',
    difficulty_level: null,
    image: null,
    started_at: metadata.effectiveStartDate.toISOString(),
    total_days: metadata.totalDays,
    start_date: metadata.effectiveStartDate.toISOString(),
  };
}
