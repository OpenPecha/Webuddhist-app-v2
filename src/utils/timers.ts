import type { PresetTimer } from '@/types/timers';

export function sortPresetTimers(timers: PresetTimer[]): PresetTimer[] {
  return [...timers].sort((a, b) => a.durationMs - b.durationMs);
}
