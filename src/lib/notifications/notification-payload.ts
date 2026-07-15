export interface NotificationNavPayload {
  itemId: string;
  itemType: string;
  planId?: string;
  day?: string;
}

export function encodeRoutinePayload(
  routineItemId: string,
  itemType: string,
  planId?: string,
): string {
  return JSON.stringify({
    itemId: routineItemId,
    itemType,
    ...(planId ? { planId } : {}),
  } satisfies NotificationNavPayload);
}

export function parseNotificationPayload(raw: unknown): NotificationNavPayload | null {
  if (raw == null) return null;
  try {
    const parsed =
      typeof raw === 'string'
        ? (JSON.parse(raw) as NotificationNavPayload)
        : (raw as NotificationNavPayload);
    if (!parsed?.itemId || !parsed?.itemType) return null;
    return parsed;
  } catch {
    return null;
  }
}
