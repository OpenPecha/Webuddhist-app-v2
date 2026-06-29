import { SPECIAL_PLAN_NOTIFICATIONS } from '@/constants/special-plan-notifications';

/** Diagnostic test notification ID. */
export const DIAGNOSTIC_TEST_NOTIFICATION_ID = 9999;

export const SPECIAL_PLAN_ONE_SHOT_BASE = 800;
export const SPECIAL_PLAN_ONE_SHOT_MAX = 899;
export const SPECIAL_PLAN_SERIES_BASE = 810;
export const SPECIAL_PLAN_SERIES_SLOT = 10;
export const ROUTINE_BLOCK_MIN = 1000;
export const ROUTINE_BLOCK_MAX = 999999;
export const PLAN_ONE_SHOT_BASE = 9_000_000;
export const PLAN_ONE_SHOT_MAX = 9_009_999;
export const PLAN_SERIES_BASE = 10_000_000;
export const PLAN_SERIES_SLOT = 500;
export const PLAN_SERIES_MAX = 15_004_999;

export function specialPlanSeriesId(planId: string, day: number): number {
  const slot = Object.keys(SPECIAL_PLAN_NOTIFICATIONS).indexOf(planId);
  if (slot < 0) throw new Error(`${planId} is not a special plan`);
  return SPECIAL_PLAN_SERIES_BASE + slot * SPECIAL_PLAN_SERIES_SLOT + (day - 1);
}

export function specialPlanOneShotId(dayIndex: number): number {
  return SPECIAL_PLAN_ONE_SHOT_BASE + (dayIndex - 1);
}

export function planSeriesId(planId: string, day: number): number {
  const slot = Math.abs(hashString(planId)) % 10_000;
  return PLAN_SERIES_BASE + slot * PLAN_SERIES_SLOT + (day - 1);
}

export function planOneShotId(planId: string): number {
  return PLAN_ONE_SHOT_BASE + (Math.abs(hashString(planId)) % 10_000);
}

export function isOurNotificationId(id: number): boolean {
  if (id === DIAGNOSTIC_TEST_NOTIFICATION_ID) return true;
  if (id >= SPECIAL_PLAN_ONE_SHOT_BASE && id <= SPECIAL_PLAN_ONE_SHOT_MAX) return true;
  if (id >= ROUTINE_BLOCK_MIN && id <= ROUTINE_BLOCK_MAX) return true;
  if (id >= PLAN_ONE_SHOT_BASE && id <= PLAN_ONE_SHOT_MAX) return true;
  if (id >= PLAN_SERIES_BASE && id <= PLAN_SERIES_MAX) return true;
  return false;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return hash;
}
