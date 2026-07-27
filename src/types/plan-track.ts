import type { DayVideoSummary } from '@/types/plan-catalog';

export interface PlanDaySubTask {
  id: string;
  display_order: number | null;
  is_completed: boolean;
  duration: string | null;
  content_type: string;
  content: string;
  source_text_id?: string | null;
  segment_ids?: string[] | null;
  pecha_segment_id?: string | null;
  start_ms?: number | null;
  end_ms?: number | null;
  audio_url?: string | null;
}

export interface PlanDayTask {
  id: string;
  title: string;
  estimated_time: number | null;
  display_order: number;
  is_completed: boolean;
  sub_tasks: PlanDaySubTask[];
}

export interface UserPlanDayDetails {
  id: string;
  day_number: number;
  tasks: PlanDayTask[];
  is_completed: boolean;
  videos?: DayVideoSummary[];
  audio_url?: string | null;
  thumbnail_url?: string | null;
  shareable_image_url?: string | null;
}

export interface UserPlanProgress {
  id: string;
  plan_id: string;
  started_at: string;
  streak_count: number;
  longest_streak: number;
  status: string;
  is_completed: boolean;
  plan?: {
    id?: string;
    title?: string;
    total_days?: number;
    language?: string;
  };
}
