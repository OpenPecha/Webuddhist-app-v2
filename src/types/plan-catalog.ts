import type { ImageSizes } from '@/types/api';

export interface PlanDayBasic {
  id: string;
  day_number: number;
}

export interface PlanDaysResponse {
  days: PlanDayBasic[];
}

export interface DayVideoSummary {
  id: string;
  url: string;
  video_id?: string | null;
  title?: string | null;
  display_order: number;
}

export interface PublicPlanSubTask {
  id: string;
  content_type: string;
  content?: string | null;
  duration?: string | null;
  display_order?: number | null;
  source_text_id?: string | null;
  segment_ids?: string[] | null;
  pecha_segment_id?: string | null;
  audio_url?: string | null;
  start_ms?: number | null;
  end_ms?: number | null;
}

export interface PublicPlanTask {
  id: string;
  title?: string | null;
  estimated_time?: number | null;
  display_order?: number;
  subtasks: PublicPlanSubTask[];
}

export interface PublicPlanDayDetail {
  id: string;
  day_number: number;
  tasks: PublicPlanTask[];
  audio_url?: string | null;
  audio_duration_ms?: number | null;
  videos: DayVideoSummary[];
}

export interface PublicPlanDetail {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty_level?: string | null;
  image?: ImageSizes | null;
  total_days: number;
  start_date?: string | null;
  display_order?: number | null;
  group_id?: string | null;
}
