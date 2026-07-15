export type PlanContentType = 'TEXT' | 'SOURCE_REFERENCE' | 'IMAGE';

export interface PlanTextItem {
  subTaskId: string;
  taskId: string;
  taskTitle: string;
  contentType: PlanContentType;
  sourceTextId?: string | null;
  segmentIds?: string[] | null;
  pechaSegmentId?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  startMs?: number | null;
  endMs?: number | null;
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
