import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import {
  ALL_PLANS_SERIES_PAGE_SIZE,
  fetchSeriesList,
} from '@/services/series';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useAllPlansSeries() {
  const language = useContentLanguage();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.series.allPlans(language),
    queryFn: ({ pageParam = 0 }) =>
      fetchSeriesList(language, pageParam, ALL_PLANS_SERIES_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.skip + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },
  });
}
