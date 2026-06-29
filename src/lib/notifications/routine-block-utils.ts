import { ROUTINE_BLOCK_MAX, ROUTINE_BLOCK_MIN } from '@/lib/notifications/notification-id-scheme';

/** Converts API `time_int` (e.g. 630) to 24h hour and minute. */
export function timeIntToHourMinute(timeInt: number): { hour: number; minute: number } {
  return {
    hour: Math.floor(timeInt / 100),
    minute: timeInt % 100,
  };
}

/** FNV-1a stable notification ID from block UUID — mirrors Flutter `RoutineBlock.notificationId`. */
export function routineBlockNotificationId(blockId: string): number {
  const fnvPrime = 0x01000193;
  const fnvOffset = 0x811c9dc5;
  let hash = fnvOffset;
  for (let i = 0; i < blockId.length; i++) {
    hash ^= blockId.charCodeAt(i);
    hash = Math.imul(hash, fnvPrime);
  }
  const unsigned = hash >>> 0;
  return (unsigned % (ROUTINE_BLOCK_MAX - ROUTINE_BLOCK_MIN + 1)) + ROUTINE_BLOCK_MIN;
}

export function dateStamp(date: Date): string {
  const y = date.getFullYear().toString().padStart(4, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
