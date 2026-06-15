/** Converts API `time_int` (e.g. 630 → 6:30 AM) to 12-hour display string. */
export function formatRoutineTimeFromInt(timeInt: number): string {
  const hour24 = Math.floor(timeInt / 100);
  const minute = timeInt % 100;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}
