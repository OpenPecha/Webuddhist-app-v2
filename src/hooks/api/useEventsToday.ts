import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { fetchEventsToday } from '@/services/events';
import { useQuery } from '@tanstack/react-query';

export function useEventsToday(limit = 20) {
  const language = useContentLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.events.today(language, limit),
    queryFn: () => fetchEventsToday(language, limit),
  });
}
