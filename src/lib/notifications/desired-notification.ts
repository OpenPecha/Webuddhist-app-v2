import type { RoutineItem } from '@/types/routine';

export interface DesiredNotification {
  id: number;
  /** Null for immediate catch-up notifications. */
  fireAt: Date | null;
  title: string;
  body: string;
  payload: string | null;
  sourceItem?: RoutineItem;
  enrollmentPlanId?: string;
  isDailyRepeat?: boolean;
  isImmediate?: boolean;
  debugCase: string;
}

export type SyncTrigger =
  | 'coldStart'
  | 'appResume'
  | 'appLaunch'
  | 'userPlansRefreshed'
  | 'routineSaved'
  | 'blockDeleted'
  | 'planEnrolled'
  | 'planUnenrolled'
  | 'masterToggle'
  | 'routineToggle'
  | 'recitationToggle'
  | 'permissionChanged'
  | 'loggedIn'
  | 'loggedOut';

export interface NotificationSyncReport {
  scheduled: number;
  cancelled: number;
  skipped: number;
  durationMs: number;
}

export const PLAN_SERIES_MAX_SCHEDULED_DAYS = 60;
export const MAX_TOTAL_SCHEDULED = 60;
