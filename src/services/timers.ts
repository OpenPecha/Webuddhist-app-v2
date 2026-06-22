import { FALLBACK_PRESET_TIMERS } from '@/constants/timer-presets';
import { http } from '@/lib/http';
import type { PresetTimer, TimersResponse } from '@/types/timers';

export async function fetchPresetTimers(skip = 0, limit = 20): Promise<PresetTimer[]> {
  try {
    const { data } = await http.get<TimersResponse>('/timers', {
      params: { skip, limit },
    });
    const timers = (data.timers ?? []).map((timer) => ({
      id: timer.id ?? '',
      name: timer.name ?? '',
      durationMs: (timer as { duration?: number }).duration ?? timer.durationMs ?? 0,
      audioUrl: timer.audioUrl ?? null,
    }));
    return timers.length > 0 ? timers : FALLBACK_PRESET_TIMERS;
  } catch {
    return FALLBACK_PRESET_TIMERS;
  }
}
