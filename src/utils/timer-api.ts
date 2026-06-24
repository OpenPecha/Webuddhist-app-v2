const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Backend `timer_id` must be a UUID — fallback preset ids are UI-only. */
export function isTimerApiId(timerId: string): boolean {
  return UUID_REGEX.test(timerId);
}
