import type { ImageSizes } from '@/types/api';
import type { AuthorGroupSummary } from '@/types/groups';

export interface SeriesMetadata {
  id: string;
  title: string;
  description: string;
  language: string;
  sub_title?: string | null;
}

/** List-item progress from GET /series (Flutter SeriesProgress). */
export interface SeriesListProgress {
  total_day_count: number;
  current_day_number: number;
}

/** Partner group chip on series list rows (Flutter SeriesPartner). */
export interface SeriesPartner {
  group_name: string;
  group_image?: string | null;
}

export interface Series {
  id: string;
  metadata: SeriesMetadata;
  image: ImageSizes;
  image_key: string;
  image_url?: string | null;
  author_id: string;
  featured: boolean;
  status: string;
  plan_count: number;
  total_days: number;
  enrolled_count?: number;
  start_date?: string | null;
  end_date?: string | null;
  group?: AuthorGroupSummary | null;
  progress?: SeriesListProgress | null;
  partner?: SeriesPartner | null;
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
  start_date: string | null;
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
  enrolled_count: number;
  group_id: string | null;
  group?: AuthorGroupSummary | null;
}

export interface SeriesListResponse {
  series: Series[];
  skip: number;
  limit: number;
  total: number;
}

export interface UserSeriesEnrollment {
  id: string;
  series_id: string;
  series_title: string;
  enrolled_at: string;
  status: string;
  current_plan_id?: string | null;
}

export interface UserSeriesEnrollmentsResponse {
  enrollments: UserSeriesEnrollment[];
  skip: number;
  limit: number;
  total: number;
}

export interface SeriesProgressPlan {
  id: string;
  title: string;
  description: string;
  language: string;
  image?: ImageSizes | null;
  started_at?: string | null;
  total_days: number;
  start_date?: string | null;
  display_order?: number | null;
}

export interface UserSeriesProgressResponse {
  id: string;
  series_id: string;
  series_title: string;
  current_plan_id?: string | null;
  plans: SeriesProgressPlan[];
  group?: AuthorGroupSummary | null;
}

export function pickSeriesMetadata(
  metadata: SeriesMetadata[] | SeriesMetadata | null | undefined,
  language: string,
): SeriesMetadata | undefined {
  if (!metadata) return undefined;
  const list = Array.isArray(metadata) ? metadata : [metadata];
  if (!list.length) return undefined;
  const lang = language.toLowerCase();
  return (
    list.find((m) => m.language.toLowerCase() === lang) ??
    list.find((m) => m.language.toUpperCase() === lang.toUpperCase()) ??
    list[0]
  );
}
