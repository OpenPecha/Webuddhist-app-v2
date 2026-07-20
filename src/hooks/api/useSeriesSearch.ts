import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { fetchSeriesList, SERIES_SEARCH_PAGE_SIZE } from '@/services/series';
import { useQuery } from '@tanstack/react-query';

export function useSeriesSearch(search: string) {
  const language = useContentLanguage();
  const normalized = search.trim();

  return useQuery({
    queryKey: QUERY_KEYS.series.search(language, normalized),
    queryFn: () =>
      fetchSeriesList(language, 0, SERIES_SEARCH_PAGE_SIZE, normalized),
    enabled: normalized.length > 0,
  });
}
