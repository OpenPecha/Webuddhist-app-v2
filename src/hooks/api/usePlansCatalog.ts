import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { fetchPlans, PLANS_CATALOG_PAGE_SIZE } from '@/services/plans';
import { useInfiniteQuery } from '@tanstack/react-query';

export function usePlansCatalog(search = '') {
  const language = useContentLanguage();
  const normalizedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.plans.list(language, normalizedSearch),
    queryFn: ({ pageParam = 0 }) =>
      fetchPlans(language, pageParam, PLANS_CATALOG_PAGE_SIZE, normalizedSearch || undefined),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.skip + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },
  });
}
