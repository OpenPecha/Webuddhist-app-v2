import { http } from '@/lib/http';
import { ENDPOINTS } from '@/lib/api-config';
import type {
  SeriesDetail,
  SeriesListResponse,
  UserSeriesEnrollmentsResponse,
  UserSeriesProgressResponse,
} from '@/types/series';

export const ALL_PLANS_SERIES_PAGE_SIZE = 20;
export const SERIES_SEARCH_PAGE_SIZE = 10;

export async function fetchSeriesList(
  language = 'en',
  skip = 0,
  limit = 10,
  search?: string,
): Promise<SeriesListResponse> {
  const params: Record<string, string | number> = { language, skip, limit };
  if (search?.trim()) params.search = search.trim();

  const { data } = await http.get<SeriesListResponse>(ENDPOINTS.series.list, {
    params,
  });
  return data;
}

export async function fetchSeriesById(
  id: string,
  language = 'en',
): Promise<SeriesDetail> {
  const { data } = await http.get<SeriesDetail>(ENDPOINTS.series.detail(id), {
    params: { language },
  });
  return data;
}

export interface EnrollSeriesRequest {
  series_id: string;
  auto_enroll_next?: boolean;
  start_immediately?: boolean;
}

export async function enrollInSeries(request: EnrollSeriesRequest): Promise<void> {
  await http.post(ENDPOINTS.series.userSeries, request);
}

export async function fetchUserSeriesEnrollments(
  language = 'en',
  status = 'ACTIVE',
  skip = 0,
  limit = 50,
): Promise<UserSeriesEnrollmentsResponse> {
  const { data } = await http.get<UserSeriesEnrollmentsResponse>(
    ENDPOINTS.series.userSeries,
    { params: { language, status, skip, limit } },
  );
  return data;
}

export async function fetchUserSeriesProgress(
  seriesId: string,
  language = 'en',
): Promise<UserSeriesProgressResponse> {
  const { data } = await http.get<UserSeriesProgressResponse>(
    ENDPOINTS.series.userSeriesProgress(seriesId),
    { params: { language } },
  );
  return data;
}
