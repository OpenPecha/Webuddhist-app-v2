export interface PlanDaySubTask {
  id: string;
  display_order: number | null;
  is_completed: boolean;
  duration: string | null;
  content_type: string;
  content: string;
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
