import { parseCalendarDate } from '@/utils/plan-utils';

/** Fixed English calendar labels (Flutter PlanDateFormat parity). */
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function calendarDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Formats a single calendar date, e.g. `1 May 2025`. */
export function formatPlanDate(date: Date, includeYear = true): string {
  const normalized = calendarDateOnly(date);
  const month = MONTHS[normalized.getMonth()];
  if (!includeYear) return `${normalized.getDate()} ${month}`;
  return `${normalized.getDate()} ${month} ${normalized.getFullYear()}`;
}

/** Formats an inclusive range, e.g. `6 Jul 2026 - 11 Jul 2027`. */
export function formatPlanDateRange(
  start: Date,
  end: Date,
  includeYear = true,
): string {
  return `${formatPlanDate(start, includeYear)} - ${formatPlanDate(end, includeYear)}`;
}

export function formatPlanDateRangeOrNull(
  start: string | Date | null | undefined,
  end: string | Date | null | undefined,
  includeYear = true,
): string | null {
  if (start == null || end == null) return null;
  const startDate = typeof start === 'string' ? parseCalendarDate(start) : start;
  const endDate = typeof end === 'string' ? parseCalendarDate(end) : end;
  if (!startDate || !endDate) return null;
  return formatPlanDateRange(startDate, endDate, includeYear);
}

