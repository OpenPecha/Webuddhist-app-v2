import { http } from '@/lib/http';
import { ENDPOINTS } from '@/lib/api-config';
import type { SeriesDetail, SeriesListResponse } from '@/types/series';

export async function fetchSeriesList(
  language = 'en',
  skip = 0,
  limit = 10,
): Promise<SeriesListResponse> {
  const { data } = await http.get<SeriesListResponse>(ENDPOINTS.series.list, {
    params: { language, skip, limit },
  });
  return data;
}

export async function fetchSeriesById(id: string): Promise<SeriesDetail> {
  const { data } = await http.get<SeriesDetail>(ENDPOINTS.series.detail(id));
  return data;
}
