import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchCalendarMonth } from '@/services/calendar';
import { useQuery } from '@tanstack/react-query';

export function useCalendarMonth(year: number, month: number) {
  return useQuery({
    queryKey: QUERY_KEYS.calendar.month(year, month),
    queryFn: () => fetchCalendarMonth(year, month),
  });
}
