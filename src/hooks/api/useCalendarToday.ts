import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchCalendarToday } from '@/services/calendar';
import { useQuery } from '@tanstack/react-query';

export function useCalendarToday() {
  return useQuery({
    queryKey: QUERY_KEYS.calendar.today(),
    queryFn: fetchCalendarToday,
    placeholderData: (previous) => previous,
  });
}
