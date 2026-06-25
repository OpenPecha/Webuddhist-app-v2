export type PlanContentType = 'TEXT' | 'SOURCE_REFERENCE' | string;

export interface PlanTextItem {
  subTaskId: string;
  taskId: string;
  taskTitle: string;
  contentType: PlanContentType;
  sourceTextId?: string | null;
  content?: string | null;
  audioUrl?: string | null;
  isCompleted?: boolean;
}

export interface PlanNavigationContext {
  planId: string;
  dayNumber: number;
  items: PlanTextItem[];
  currentIndex: number;
  dayAudioUrl?: string | null;
  autoPlay?: boolean;
}

export type PlanReadingStartAt =
  | 'first-incomplete'
  | { taskId: string }
  | { subTaskId: string };
