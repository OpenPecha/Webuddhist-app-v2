import type { UserPlan } from '@/types/plans';
import { dayNumberFor, getEffectiveStartDate } from '@/utils/plan-utils';
import { addDays, startOfDay } from '@/lib/notifications/routine-block-utils';

export interface SeriesPlanNotificationSlot {
  calendarDate: Date;
  plan: UserPlan;
  dayNumber: number;
}

export function planStartDay(plan: UserPlan): Date {
  return startOfDay(getEffectiveStartDate(plan));
}

export function planCoversCalendarDate(plan: UserPlan, target: Date): boolean {
  const start = planStartDay(plan);
  const end = addDays(start, plan.total_days - 1);
  const day = startOfDay(target);
  return day.getTime() >= start.getTime() && day.getTime() <= end.getTime();
}

export function isSeriesRoutineItem(itemId: string, plansById: Record<string, UserPlan>): boolean {
  return !plansById[itemId];
}

export function resolveActivePlanForDate(
  enrolledPlans: UserPlan[],
  forDate: Date,
  preferredPlanId?: string | null,
): UserPlan | null {
  const target = startOfDay(forDate);
  if (preferredPlanId) {
    const preferred = enrolledPlans.find((plan) => plan.id === preferredPlanId);
    if (preferred && planCoversCalendarDate(preferred, target)) return preferred;
  }

  let best: UserPlan | null = null;
  let bestStart: Date | null = null;
  for (const plan of enrolledPlans) {
    if (!planCoversCalendarDate(plan, target)) continue;
    const start = planStartDay(plan);
    if (!best || !bestStart || start.getTime() > bestStart.getTime()) {
      best = plan;
      bestStart = start;
    }
  }
  return best;
}

export function buildUpcomingSeriesSlots(options: {
  enrolledPlans: UserPlan[];
  now: Date;
  maxSlots: number;
  preferredPlanIdForToday?: string | null;
}): SeriesPlanNotificationSlot[] {
  const { enrolledPlans, now, maxSlots, preferredPlanIdForToday } = options;
  if (enrolledPlans.length === 0 || maxSlots <= 0) return [];

  const today = startOfDay(now);
  const slots: SeriesPlanNotificationSlot[] = [];
  let cursor = today;
  let daysScanned = 0;
  const maxScanDays = 400;

  while (slots.length < maxSlots && daysScanned < maxScanDays) {
    const plan = resolveActivePlanForDate(
      enrolledPlans,
      cursor,
      cursor.getTime() === today.getTime() ? preferredPlanIdForToday : null,
    );
    if (plan) {
      const dayNum = dayNumberFor(getEffectiveStartDate(plan), cursor, plan.total_days);
      if (dayNum >= 1) {
        slots.push({ calendarDate: cursor, plan, dayNumber: dayNum });
      }
    }
    cursor = addDays(cursor, 1);
    daysScanned++;
  }

  return slots;
}
