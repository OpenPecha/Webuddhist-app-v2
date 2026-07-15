import type { ImageSizes } from '@/types/api';

export interface UserPlan {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty_level: string | null;
  image: ImageSizes | null;
  image_url?: string | null;
  started_at: string | null;
  total_days: number;
  start_date: string | null;
  tags?: { id: string; name: string }[];
}

export interface UserPlansResponse {
  plans: UserPlan[];
  skip: number;
  limit: number;
  total: number;
}
