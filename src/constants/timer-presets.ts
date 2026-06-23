/** Fallback presets when `/timers` API is unavailable — matches Flutter default grid. */
import type { PresetTimer } from '@/types/timers';

export const MEDITATION_PRESET_MINUTES = [5, 10, 15, 30] as const;

export const MEDITATION_PRESET_DURATION_MS = MEDITATION_PRESET_MINUTES.map(
  (minutes) => minutes * 60 * 1000,
);

/** Converts API `duration` field to milliseconds — handles ms, seconds, or minutes. */
export function apiDurationToMs(raw: number): number {
  if (raw <= 0) return raw;

  const candidates = [raw, raw * 1000, raw * 60 * 1000];
  for (const ms of candidates) {
    if (MEDITATION_PRESET_DURATION_MS.includes(ms)) return ms;
  }

  return raw;
}

export const FALLBACK_PRESET_TIMERS: PresetTimer[] = MEDITATION_PRESET_MINUTES.map((minutes) => ({
  id: `preset-${minutes}`,
  name: `${minutes} min`,
  durationMs: minutes * 60 * 1000,
}));

/** Keeps only 5/10/15/30 min presets; falls back when API returns none. */
export function filterMeditationPresets(timers: PresetTimer[]): PresetTimer[] {
  const allowed = new Set<number>(MEDITATION_PRESET_DURATION_MS);
  const byDuration = new Map<number, PresetTimer>();

  for (const timer of timers) {
    const durationMs = apiDurationToMs(timer.durationMs);
    if (!allowed.has(durationMs) || byDuration.has(durationMs)) continue;
    byDuration.set(durationMs, { ...timer, durationMs });
  }

  const filtered = MEDITATION_PRESET_DURATION_MS.map((durationMs) => byDuration.get(durationMs)).filter(
    (timer): timer is PresetTimer => timer != null,
  );

  return filtered.length > 0 ? filtered : FALLBACK_PRESET_TIMERS;
}
