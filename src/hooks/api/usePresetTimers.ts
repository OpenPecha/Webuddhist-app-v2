import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchPresetTimers } from '@/services/timers';
import { useQuery } from '@tanstack/react-query';

export function usePresetTimers(skip = 0, limit = 20) {
  return useQuery({
    queryKey: QUERY_KEYS.timers.list(skip, limit),
    queryFn: () => fetchPresetTimers(skip, limit),
  });
}
