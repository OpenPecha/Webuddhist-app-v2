import { StorageKeys, getAllKeys, getBoolean, remove, setBoolean, setString } from '@/lib/storage';
import { dateStamp } from '@/lib/notifications/routine-block-utils';

function startedAtKey(planId: string): string {
  return `${StorageKeys.specialPlanStartedAtPrefix}${planId}`;
}

function shownOnKey(planId: string, date: Date): string {
  return `${StorageKeys.specialPlanDay1ShownPrefix}${planId}_${dateStamp(date)}`;
}

export async function wasSpecialPlanShownOn(planId: string, date: Date): Promise<boolean> {
  return (await getBoolean(shownOnKey(planId, date))) === true;
}

export async function markSpecialPlanShownOn(planId: string, date: Date): Promise<void> {
  await setBoolean(shownOnKey(planId, date), true);
}

export async function setSpecialPlanStartedAt(planId: string, startedAt: Date): Promise<void> {
  await setString(startedAtKey(planId), startedAt.toISOString());
}

export async function clearSpecialPlanStartedAtOnly(planId: string): Promise<void> {
  await remove(startedAtKey(planId));
}

export async function clearAllSpecialPlanData(): Promise<void> {
  const keys = await getAllKeys();
  await Promise.all(
    keys
      .filter(
        (key) =>
          key.startsWith(StorageKeys.specialPlanStartedAtPrefix) ||
          key.startsWith(StorageKeys.specialPlanDay1ShownPrefix),
      )
      .map((key) => remove(key)),
  );
}
