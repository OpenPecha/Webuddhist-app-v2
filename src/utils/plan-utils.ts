import type { PublicPlanDetail } from '@/types/plan-catalog';
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
  if (plan.started_at) return dateOnly(new Date(plan.started_at));
  return dateOnly(new Date());
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

export function createCatalogPlanDateRange(
  startDate: string | null | undefined,
  totalDays: number,
  now = new Date(),
): PlanDateRange | null {
  if (totalDays <= 0 || !startDate) return null;
  const start = parseCalendarDate(startDate);
  if (!start) return null;
  const end = dateOnly(new Date(start.getTime() + (totalDays - 1) * 86_400_000));
  const today = dateOnly(now);
  const isCurrent = today >= start && today <= end;
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
  const formatted = `${formatter.format(start)} - ${formatter.format(end)}`;
  return { start, end, totalDays, isCurrent, formatted };
}

export function resolveUserPlanForItem(
  planId: string,
  plans: UserPlan[],
): UserPlan | undefined {
  return plans.find((plan) => plan.id === planId);
}

/** Track screen plan: list membership + optional catalog fields (Flutter UserPlansModel). */
export function resolveTrackUserPlan(
  planId: string,
  userPlans: UserPlan[],
  planDetail?: PublicPlanDetail | null,
): UserPlan | null {
  const fromList = resolveUserPlanForItem(planId, userPlans);
  if (fromList) {
    if (!planDetail) return fromList;
    return {
      ...fromList,
      description: fromList.description || planDetail.description || '',
      image: fromList.image ?? planDetail.image ?? null,
      start_date: fromList.start_date ?? planDetail.start_date ?? null,
      total_days: fromList.total_days || planDetail.total_days,
    };
  }
  if (!planDetail) return null;
  return {
    id: planId,
    title: planDetail.title,
    description: planDetail.description ?? '',
    language: planDetail.language,
    difficulty_level: planDetail.difficulty_level ?? null,
    image: planDetail.image ?? null,
    started_at: null,
    total_days: planDetail.total_days,
    start_date: planDetail.start_date ?? null,
  };
}

/** Days unlocked in preview before calendar start for first plan in a series. */
export const FIRST_PLAN_PREVIEW_DAY_COUNT = 10;

export function isFutureFixedDatePlan(startDate: string | null | undefined): boolean {
  const start = parseCalendarDate(startDate);
  if (!start) return false;
  return start > dateOnly(new Date());
}

export function defaultPreviewSelectedDay(
  startDate: string | null | undefined,
  totalDays: number,
): number {
  if (!startDate) return 1;
  const start = parseCalendarDate(startDate);
  if (!start) return 1;
  const day = dayNumberFor(start, new Date(), totalDays);
  if (day < 1) return 1;
  return day;
}

export function firstMissedDay(
  planStartDate: Date,
  totalDays: number,
  completionStatus: Record<number, boolean>,
): number | null {
  const todayDayNumber = dayNumberFor(planStartDate, new Date(), totalDays);
  for (let day = 1; day < todayDayNumber; day++) {
    if (completionStatus[day] !== true) return day;
  }
  return null;
}

export function dateForPlanDay(startDate: Date, dayNumber: number): Date {
  return dateOnly(new Date(startDate.getTime() + (dayNumber - 1) * 86_400_000));
}

export function formatCarouselDayLabel(startDate: Date | null, dayNumber: number): string {
  if (!startDate) return String(dayNumber);
  const date = dateForPlanDay(startDate, dayNumber);
  return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short' }).format(date);
}

export function buildDisabledDaysForCarousel(options: {
  totalDays: number;
  startDate?: Date | null;
  previewUnlockDayCount?: number;
  isTrackMode?: boolean;
}): Set<number> {
  const { totalDays, startDate, previewUnlockDayCount, isTrackMode } = options;
  const locked = new Set<number>();

  if (isTrackMode && startDate) {
    const today = dateOnly(new Date());
    const unlockCount = previewUnlockDayCount ?? 0;
    for (let day = 1; day <= totalDays; day++) {
      const dayDate = dateForPlanDay(startDate, day);
      if (dayDate > today && day > unlockCount) locked.add(day);
    }
    return locked;
  }

  if (startDate && previewUnlockDayCount != null) {
    const today = dateOnly(new Date());
    for (let day = 1; day <= totalDays; day++) {
      const dayDate = dateForPlanDay(startDate, day);
      if (dayDate > today) {
        const daysBeforeStart = Math.floor(
          (startDate.getTime() - dayDate.getTime()) / 86_400_000,
        );
        if (daysBeforeStart >= previewUnlockDayCount) locked.add(day);
      }
    }
  }

  return locked;
}

export interface NavigableSubtask {
  subTaskId: string;
  sourceTextId?: string | null;
  contentType?: string;
}

export function findFirstIncompleteNavigableSubtask(
  tasks: {
    is_completed?: boolean;
    subtasks: {
      id: string;
      is_completed?: boolean;
      source_text_id?: string | null;
      content_type?: string;
      content?: string | null;
    }[];
  }[],
): NavigableSubtask | null {
  for (const task of tasks) {
    if (task.is_completed) continue;
    for (const sub of task.subtasks) {
      if (sub.is_completed) continue;
      const contentType = (sub.content_type ?? '').toUpperCase();
      if (sub.source_text_id) {
        return {
          subTaskId: sub.id,
          sourceTextId: sub.source_text_id,
          contentType: sub.content_type,
        };
      }
      if (
        (contentType === 'TEXT' || contentType === 'INLINE_TEXT' || !sub.content_type) &&
        sub.content?.trim()
      ) {
        return {
          subTaskId: sub.id,
          contentType: sub.content_type ?? 'TEXT',
        };
      }
    }
  }
  return null;
}
