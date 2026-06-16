export type SessionTypeApi = 'PLAN' | 'RECITATION';

export interface SessionRequest {
  session_type: SessionTypeApi;
  source_id: string;
  display_order: number;
}

export interface TimeBlockRequest {
  time: string;
  time_int: number;
  notification_enabled: boolean;
  sessions: SessionRequest[];
}

export interface RoutineWithTimeBlocksResponse {
  id: string;
  time_blocks: {
    id: string;
    time: string;
    time_int: number;
    notification_enabled: boolean;
    sessions: unknown[];
  }[];
}
