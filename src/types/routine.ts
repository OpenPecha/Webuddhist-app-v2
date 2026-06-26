import type { ImageSizes } from '@/types/api';

export type RoutineItemType = 'plan' | 'recitation' | 'series';

export interface RoutineItem {
  id: string;
  title: string;
  coverImage: ImageSizes | null;
  imageUrl?: string | null;
  type: RoutineItemType;
  enrolledAt?: string | null;
  language?: string | null;
  startDate?: string | null;
  currentPlanId?: string | null;
  currentPlanTitle?: string | null;
}

export interface RoutineBlock {
  id: string;
  timeInt: number;
  formattedTime: string;
  notificationEnabled: boolean;
  items: RoutineItem[];
}

export interface RoutineData {
  apiRoutineId: string;
  blocks: RoutineBlock[];
}

export function routineHasItems(routine: RoutineData | null | undefined): boolean {
  return routine?.blocks.some((block) => block.items.length > 0) ?? false;
}

// ─── API DTOs ───

export interface SessionDTO {
  id: string;
  session_type: 'PLAN' | 'RECITATION' | 'SERIES';
  source_id: string;
  title: string;
  language: string;
  image?: ImageSizes | null;
  image_url?: string | null;
  display_order: number;
  start_date?: string | null;
  started_at?: string | null;
  current_plan_id?: string | null;
  current_plan_title?: string | null;
}

export interface TimeBlockDTO {
  id: string;
  time: string;
  time_int: number;
  notification_enabled: boolean;
  sessions: SessionDTO[];
}

export interface RoutineResponse {
  id: string;
  time_blocks: TimeBlockDTO[];
  skip: number;
  limit: number;
  total: number;
}
