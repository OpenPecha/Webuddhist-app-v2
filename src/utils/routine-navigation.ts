import { fetchUserPlans } from '@/services/plans';
import type { UserPlan } from '@/types/plans';
import type { RoutineItem } from '@/types/routine';
import {
  dateOnly,
  getCurrentDay,
  getEffectiveStartDate,
  parseCalendarDate,
  resolveUserPlanForItem,
} from '@/utils/plan-utils';

export function selectedDayForRoutinePlan(
  userPlan: UserPlan,
  item: RoutineItem,
): number {
  const enrolled = parseCalendarDate(item.enrolledAt ?? item.startDate);
  const start = enrolled ?? getEffectiveStartDate(userPlan);
  const today = dateOnly(new Date());
  const normalizedStart = dateOnly(start);
  const daysSince = Math.floor(
    (today.getTime() - normalizedStart.getTime()) / 86_400_000,
  );
  const day = daysSince + 1;
  if (day < 1) return 1;
  if (day > userPlan.total_days) return userPlan.total_days;
  return day;
}

export async function resolveUserPlanForRoutineItem(
  item: RoutineItem,
  cachedPlans: UserPlan[],
  appLanguage: string,
): Promise<UserPlan | null> {
  const itemLang = item.language?.toLowerCase();
  const sameLanguage =
    !itemLang || itemLang === appLanguage.toLowerCase();

  let plan = resolveUserPlanForItem(item.id, cachedPlans);
  if (plan) return plan;

  if (sameLanguage) {
    const response = await fetchUserPlans(appLanguage);
    plan = resolveUserPlanForItem(item.id, response.plans);
    if (plan) return plan;
  }

  if (itemLang) {
    const response = await fetchUserPlans(itemLang);
    plan = resolveUserPlanForItem(item.id, response.plans);
    if (plan) return plan;
  }

  return null;
}

export { getCurrentDay };
