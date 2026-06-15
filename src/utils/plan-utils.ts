import type { UserPlan } from '@/types/plans';

export function dateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Preserves calendar day from UTC midnight ISO strings (matches Flutter PlanUtils). */
export function parseCalendarDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  const utc = parsed;
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
}

export function getEffectiveStartDate(plan: UserPlan): Date {
  const calendarStart = parseCalendarDate(plan.start_date);
  if (calendarStart) return calendarStart;
  return dateOnly(new Date(plan.started_at));
}

export function dayNumberFor(
  planStartDate: Date,
  forDate: Date,
  totalDays: number,
): number {
  const normalizedStart = dateOnly(planStartDate);
  const normalizedTarget = dateOnly(forDate);
  if (normalizedTarget < normalizedStart) return 0;
  const diff =
    Math.floor((normalizedTarget.getTime() - normalizedStart.getTime()) / 86_400_000) + 1;
  if (diff > totalDays) return totalDays;
  return diff;
}

export function calculateMissedDays(
  planStartDate: Date,
  totalDays: number,
  completionStatus: Record<number, boolean>,
): number {
  const todayDayNumber = dayNumberFor(planStartDate, new Date(), totalDays);
  let missedCount = 0;
  for (let day = 1; day < todayDayNumber; day++) {
    if (completionStatus[day] !== true) missedCount++;
  }
  return missedCount;
}

/** Current plan day (1-based), clamped to [1, total_days]. */
export function getCurrentDay(plan: UserPlan, now = new Date()): number {
  return dayNumberFor(getEffectiveStartDate(plan), now, plan.total_days) || 1;
}

export interface PlanDateRange {
  start: Date;
  end: Date;
  totalDays: number;
  isCurrent: boolean;
  formatted: string;
}

export function createPlanDateRange(plan: UserPlan, now = new Date()): PlanDateRange | null {
  if (plan.total_days <= 0) return null;

  const start = getEffectiveStartDate(plan);
  const end = dateOnly(new Date(start.getTime() + (plan.total_days - 1) * 86_400_000));
  const today = dateOnly(now);
  const isCurrent = today >= start && today <= end;

  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
  const formatted = `${formatter.format(start)} - ${formatter.format(end)}`;

  return { start, end, totalDays: plan.total_days, isCurrent, formatted };
}

export function resolveUserPlanForItem(
  planId: string,
  plans: UserPlan[],
): UserPlan | undefined {
  return plans.find((plan) => plan.id === planId);
}
