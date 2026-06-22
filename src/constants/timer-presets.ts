/** Fallback presets when `/timers` API is unavailable — common meditation durations. */
import type { PresetTimer } from '@/types/timers';

export const FALLBACK_PRESET_TIMERS: PresetTimer[] = [
  { id: 'preset-5', name: '5 min', durationMs: 5 * 60 * 1000 },
  { id: 'preset-10', name: '10 min', durationMs: 10 * 60 * 1000 },
  { id: 'preset-15', name: '15 min', durationMs: 15 * 60 * 1000 },
  { id: 'preset-20', name: '20 min', durationMs: 20 * 60 * 1000 },
  { id: 'preset-30', name: '30 min', durationMs: 30 * 60 * 1000 },
  { id: 'preset-45', name: '45 min', durationMs: 45 * 60 * 1000 },
  { id: 'preset-60', name: '60 min', durationMs: 60 * 60 * 1000 },
];
