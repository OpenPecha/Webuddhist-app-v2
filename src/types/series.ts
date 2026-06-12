import type { ImageSizes } from '@/types/api';

export interface SeriesMetadata {
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

export interface SeriesListResponse {
  series: Series[];
  skip: number;
  limit: number;
  total: number;
}
