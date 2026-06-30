import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchPresetTimers } from '@/services/timers';
import { useQuery } from '@tanstack/react-query';

export function usePresetTimers() {
  return useQuery({
    queryKey: QUERY_KEYS.timers.list(),
    queryFn: fetchPresetTimers,
    staleTime: 5 * 60_000,
  });
}
