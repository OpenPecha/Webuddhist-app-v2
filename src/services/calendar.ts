import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { CalendarDay, CalendarMonth } from '@/types/calendar';
import { parseCalendarDayJson } from '@/utils/calendar-format';

export async function fetchCalendarToday(): Promise<CalendarDay> {
  const { data } = await http.get<{ day: Record<string, unknown> }>(
    ENDPOINTS.calendar.today,
  );
  return parseCalendarDayJson(data.day);
}

export async function fetchCalendarMonth(year: number, month: number): Promise<CalendarMonth> {
  const { data } = await http.get<{
    year: number;
    month: number;
    designation?: string | null;
    days: Record<string, unknown>[];
  }>(ENDPOINTS.calendar.month(year, month));

  return {
    year: data.year,
    month: data.month,
    designation: data.designation ?? null,
    days: (data.days ?? []).map(parseCalendarDayJson),
  };
}
