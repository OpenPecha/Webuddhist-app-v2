import { useQuery } from '@tanstack/react-query';
import { fetchSeriesList, fetchSeriesById } from '@/services/series';
import { QUERY_KEYS } from '@/constants/query-keys';

export function useSeries(language = 'en', skip = 0, limit = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.series.list(language, skip, limit),
    queryFn: () => fetchSeriesList(language, skip, limit),
  });
}

export function useSeriesById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.series.detail(id),
    queryFn: () => fetchSeriesById(id),
    enabled: !!id,
  });
}
