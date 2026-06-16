import { partsFromTimeInt, timeIntFromParts } from '@/utils/routine-edit';

export const MIN_BLOCK_GAP_MINUTES = 10;
export const MAX_ROUTINE_BLOCKS = 20;

const MINUTES_IN_DAY = 1440;
const MAX_SEARCH_RADIUS = 720;

function timeIntToMinutes(timeInt: number): number {
  const { hour24, minute } = partsFromTimeInt(timeInt);
  return hour24 * 60 + minute;
}

function minutesToTimeInt(minutes: number): number {
  const normalized = ((minutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  return timeIntFromParts(Math.floor(normalized / 60), normalized % 60);
}

function isValidSlot(candidate: number, existingMinutes: number[]): boolean {
  for (const m of existingMinutes) {
    let diff = Math.abs(candidate - m);
    if (diff > MAX_SEARCH_RADIUS) diff = MINUTES_IN_DAY - diff;
    if (diff < MIN_BLOCK_GAP_MINUTES) return false;
  }
  return true;
}

/** Nearest valid time with at least [MIN_BLOCK_GAP_MINUTES] from other blocks. */
export function adjustTimeForMinimumGap(
  pickedTimeInt: number,
  existingTimeInts: number[],
): number | null {
  if (existingTimeInts.length === 0) return pickedTimeInt;
  if (existingTimeInts.length >= MAX_ROUTINE_BLOCKS) return null;

  const pickedMin = timeIntToMinutes(pickedTimeInt);
  const existingMin = existingTimeInts.map(timeIntToMinutes).sort((a, b) => a - b);

  if (isValidSlot(pickedMin, existingMin)) return pickedTimeInt;

  for (let delta = 1; delta <= MAX_SEARCH_RADIUS; delta++) {
    const forward = (pickedMin + delta) % MINUTES_IN_DAY;
    if (isValidSlot(forward, existingMin)) return minutesToTimeInt(forward);

    const backward = (pickedMin - delta + MINUTES_IN_DAY) % MINUTES_IN_DAY;
    if (isValidSlot(backward, existingMin)) return minutesToTimeInt(backward);
  }

  return null;
}

export function canAddBlock(currentCount: number): boolean {
  return currentCount < MAX_ROUTINE_BLOCKS;
}

export function sortBlocksByTime<T extends { timeInt: number }>(blocks: T[]): T[] {
  return [...blocks].sort((a, b) => a.timeInt - b.timeInt);
}

export function dateFromTimeInt(timeInt: number): Date {
  const { hour24, minute } = partsFromTimeInt(timeInt);
  const d = new Date();
  d.setHours(hour24, minute, 0, 0);
  return d;
}

export function timeIntFromDate(date: Date): number {
  return timeIntFromParts(date.getHours(), date.getMinutes());
}
