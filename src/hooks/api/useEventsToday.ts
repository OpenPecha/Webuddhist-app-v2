import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { fetchEventsToday } from '@/services/events';
import { useQuery } from '@tanstack/react-query';
import { getApiLanguageSync } from '@/lib/i18n';

export function useEventsToday(limit = 20) {
  const language = useContentLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.events.today(language, limit),
    queryFn: () => fetchEventsToday(getApiLanguageSync(), limit),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
