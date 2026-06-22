/** Fallback presets when `/timers` API is unavailable — matches Flutter default grid. */
import type { PresetTimer } from '@/types/timers';

export const MEDITATION_PRESET_MINUTES = [5, 10, 15, 30] as const;

export const MEDITATION_PRESET_DURATION_MS = MEDITATION_PRESET_MINUTES.map(
  (minutes) => minutes * 60 * 1000,
);

export const FALLBACK_PRESET_TIMERS: PresetTimer[] = MEDITATION_PRESET_MINUTES.map((minutes) => ({
  id: `preset-${minutes}`,
  name: `${minutes} min`,
  durationMs: minutes * 60 * 1000,
}));

function normalizeDurationMs(durationMs: number): number {
  const canonical = MEDITATION_PRESET_DURATION_MS.find((ms) => ms === durationMs);
  if (canonical != null) return canonical;

  const minutes = Math.round(durationMs / (60 * 1000));
  const fromMinutes = minutes * 60 * 1000;
  if (MEDITATION_PRESET_DURATION_MS.includes(fromMinutes)) {
    return fromMinutes;
  }

  return durationMs;
}

/** Keeps only 5/10/15/30 min presets; falls back when API returns none. */
export function filterMeditationPresets(timers: PresetTimer[]): PresetTimer[] {
  const allowed = new Set<number>(MEDITATION_PRESET_DURATION_MS);
  const byDuration = new Map<number, PresetTimer>();

  for (const timer of timers) {
    const durationMs = normalizeDurationMs(timer.durationMs);
    if (!allowed.has(durationMs) || byDuration.has(durationMs)) continue;
    byDuration.set(durationMs, { ...timer, durationMs });
  }

  const filtered = MEDITATION_PRESET_DURATION_MS.map((durationMs) => byDuration.get(durationMs)).filter(
    (timer): timer is PresetTimer => timer != null,
  );

  return filtered.length > 0 ? filtered : FALLBACK_PRESET_TIMERS;
}
