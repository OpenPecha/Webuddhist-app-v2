import { useQuery } from '@tanstack/react-query';

import type { ImageSizes } from '@/lib/image-url';

export type { ImageSizes };

interface SeriesMetadata {
  id: string;
  title: string;
  description: string;
  language: string;
}

export interface Series {
  id: string;
  metadata: SeriesMetadata;
  image: ImageSizes;
  image_key: string;
  author_id: string;
  featured: boolean;
  status: string;
  plan_count: number;
  total_days: number;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty_level: string;
  image: ImageSizes;
  image_key: string;
  tags: string[];
  status: string;
  featured: boolean;
  display_order: number;
  start_date: string;
  total_days: number;
  group_id: string | null;
}

export interface SeriesDetail {
  id: string;
  metadata: SeriesMetadata[];
  image: ImageSizes;
  image_key: string;
  author_id: string;
  featured: boolean;
  status: string;
  plans: Plan[];
  total_days: number;
  group_id: string | null;
}

interface SeriesResponse {
  series: Series[];
  skip: number;
  limit: number;
  total: number;
}

async function fetchSeries(
  language = 'en',
  skip = 0,
  limit = 10,
): Promise<SeriesResponse> {
  const response = await fetch(
    `https://api.webuddhist.com/api/v1/series?language=${language}&skip=${skip}&limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch series');
  }

  return response.json();
}

async function fetchSeriesById(id: string): Promise<SeriesDetail> {
  const response = await fetch(
    `https://api.webuddhist.com/api/v1/series/${id}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch series');
  }
  return response.json();
}

export function useSeries(language = 'en', skip = 0, limit = 10) {
  return useQuery({
    queryKey: ['series', language, skip, limit],
    queryFn: () => fetchSeries(language, skip, limit),
  });
}

export function useSeriesById(id: string) {
  return useQuery({
    queryKey: ['series', id],
    queryFn: () => fetchSeriesById(id),
  });
}
