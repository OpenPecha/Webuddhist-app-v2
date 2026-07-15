import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { fetchFeaturedSeries } from '@/services/featured-series';
import { buildFeaturedSeriesLayout } from '@/utils/featured-series-layout';
import { useQuery } from '@tanstack/react-query';

export function useFeaturedSeries(limit = 10) {
  const language = useContentLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.series.featured(language, limit),
    queryFn: async () => {
      const series = await fetchFeaturedSeries(language, limit);
      return buildFeaturedSeriesLayout(series);
    },
    // Presigned S3 URLs expire (~1h); refetch on each home mount for fresh URLs.
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
