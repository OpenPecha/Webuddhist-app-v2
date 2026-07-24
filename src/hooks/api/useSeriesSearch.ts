import { getApiLanguageSync } from '@/lib/i18n';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { fetchSeriesList, SERIES_SEARCH_PAGE_SIZE } from '@/services/series';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useSeriesSearch(search: string) {
  const language = useContentLanguage();
  const normalized = search.trim();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.series.search(language, normalized),
    queryFn: ({ pageParam = 0 }) =>
      fetchSeriesList(getApiLanguageSync(), pageParam, SERIES_SEARCH_PAGE_SIZE, normalized),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.skip + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },
    enabled: normalized.length > 0,
  });
}
