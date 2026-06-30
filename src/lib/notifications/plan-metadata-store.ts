import { StorageKeys, getAllKeys, getBoolean, getString, remove, setBoolean, setString } from '@/lib/storage';
import { dateStamp } from '@/lib/notifications/routine-block-utils';

export interface PlanMetadata {
  effectiveStartDate: Date;
  totalDays: number;
}

function anchorKey(planId: string): string {
  return `${StorageKeys.planStartedAtPrefix}${planId}`;
}

function totalDaysKey(planId: string): string {
  return `${StorageKeys.planTotalDaysPrefix}${planId}`;
}

function immediateShownKey(planId: string, date: Date): string {
  return `${StorageKeys.planImmediateShownPrefix}${planId}_${dateStamp(date)}`;
}

function seriesScheduledKey(planId: string): string {
  return `${StorageKeys.planSeriesScheduledPrefix}${planId}`;
}

export async function getPlanMetadata(planId: string): Promise<PlanMetadata | null> {
  const [rawDate, rawTotalDays] = await Promise.all([
    getString(anchorKey(planId)),
    getString(totalDaysKey(planId)),
  ]);
  if (!rawDate || rawTotalDays == null) return null;
  const totalDays = Number(rawTotalDays);
  const effectiveStartDate = new Date(rawDate);
  if (!Number.isFinite(totalDays) || Number.isNaN(effectiveStartDate.getTime())) return null;
  return { effectiveStartDate, totalDays };
}

export async function setPlanMetadata(
  planId: string,
  effectiveStartDate: Date,
  totalDays: number,
): Promise<void> {
  await Promise.all([
    setString(anchorKey(planId), effectiveStartDate.toISOString()),
    setString(totalDaysKey(planId), String(totalDays)),
  ]);
}

export async function clearPlanEnrollmentMetadata(planId: string): Promise<void> {
  await Promise.all([remove(anchorKey(planId)), remove(totalDaysKey(planId))]);
}

export async function getAllCachedPlanIds(): Promise<string[]> {
  const keys = await getAllKeys();
  return keys
    .filter((key) => key.startsWith(StorageKeys.planStartedAtPrefix))
    .map((key) => key.replace(StorageKeys.planStartedAtPrefix, ''));
}

export async function wasPlanImmediateShownOn(planId: string, date: Date): Promise<boolean> {
  return (await getBoolean(immediateShownKey(planId, date))) === true;
}

export async function markPlanImmediateShownOn(planId: string, date: Date): Promise<void> {
  await setBoolean(immediateShownKey(planId, date), true);
}

export async function wasPlanSeriesScheduledOn(planId: string, date: Date): Promise<boolean> {
  const raw = await getString(seriesScheduledKey(planId));
  if (!raw) return false;
  const sep = raw.indexOf('|');
  const datePart = sep < 0 ? raw : raw.slice(0, sep);
  return datePart === dateStamp(date);
}

export async function markPlanSeriesScheduledOn(
  planId: string,
  date: Date,
  notificationId: number,
): Promise<void> {
  await setString(seriesScheduledKey(planId), `${dateStamp(date)}|${notificationId}`);
}

export async function clearPlanSeriesScheduledMarker(planId: string): Promise<void> {
  await remove(seriesScheduledKey(planId));
}

export async function seriesScheduledIdsOn(date: Date): Promise<Map<number, string>> {
  const stamp = dateStamp(date);
  const keys = await getAllKeys();
  const result = new Map<number, string>();
  for (const key of keys) {
    if (!key.startsWith(StorageKeys.planSeriesScheduledPrefix)) continue;
    const raw = await getString(key);
    if (!raw) continue;
    const sep = raw.indexOf('|');
    if (sep < 0 || raw.slice(0, sep) !== stamp) continue;
    const id = Number(raw.slice(sep + 1));
    if (!Number.isFinite(id)) continue;
    result.set(id, key.replace(StorageKeys.planSeriesScheduledPrefix, ''));
  }
  return result;
}

export async function clearAllPlanMetadata(): Promise<void> {
  const keys = await getAllKeys();
  const prefixes = [
    StorageKeys.planStartedAtPrefix,
    StorageKeys.planTotalDaysPrefix,
    StorageKeys.planImmediateShownPrefix,
    StorageKeys.planSeriesScheduledPrefix,
  ];
  await Promise.all(
    keys.filter((key) => prefixes.some((prefix) => key.startsWith(prefix))).map((key) => remove(key)),
  );
}
