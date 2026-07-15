import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { Series } from '@/types/series';

interface FeaturedSeriesResponse {
  series: Series[];
}

export async function fetchFeaturedSeries(
  language = 'en',
  limit = 10,
): Promise<Series[]> {
  const { data } = await http.get<FeaturedSeriesResponse>(ENDPOINTS.series.featured, {
    params: { language, limit },
  });
  return data.series ?? [];
}
