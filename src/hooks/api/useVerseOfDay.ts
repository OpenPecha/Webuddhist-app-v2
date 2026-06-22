import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { fetchVerseOfDay } from '@/services/verse-of-day';
import { useQuery } from '@tanstack/react-query';

export function useVerseOfDay() {
  const language = useContentLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.verseOfDay.today(language),
    queryFn: () => fetchVerseOfDay(language),
  });
}
