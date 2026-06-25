import { useQuery } from '@tanstack/react-query';
import { fetchSeriesList, fetchSeriesById } from '@/services/series';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';

export function useSeries(skip = 0, limit = 10) {
  const language = useContentLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.series.list(language, skip, limit),
    queryFn: () => fetchSeriesList(language, skip, limit),
  });
}

export function useSeriesById(id: string) {
  const language = useContentLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.series.detail(id, language),
    queryFn: () => fetchSeriesById(id, language),
    enabled: !!id,
  });
}
