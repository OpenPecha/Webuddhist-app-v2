import { FALLBACK_PRESET_TIMERS, apiDurationToMs, filterMeditationPresets } from '@/constants/timer-presets';
import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { PresetTimer, TimersResponse } from '@/types/timers';
import { isTimerApiId } from '@/utils/timer-api';

export async function fetchPresetTimers(skip = 0, limit = 20): Promise<PresetTimer[]> {
  try {
    const { data } = await http.get<TimersResponse>(ENDPOINTS.timers.list, {
      params: { skip, limit },
    });
    const timers = (data.timers ?? []).map((timer) => ({
      id: timer.id ?? '',
      name: timer.name ?? '',
      durationMs: apiDurationToMs(
        (timer as { duration?: number; }).duration ?? timer.durationMs ?? 0,
      ),
      audioUrl: timer.audioUrl ?? null,
    }));
    const filtered = filterMeditationPresets(timers.length > 0 ? timers : FALLBACK_PRESET_TIMERS);
    return filtered;
  } catch {
    return FALLBACK_PRESET_TIMERS;
  }
}

/** Reports elapsed meditation time — fire-and-forget, mirrors Flutter stopUserTimer. */
export async function stopUserTimer(timerId: string, durationMs: number): Promise<void> {
  if (!isTimerApiId(timerId)) {
    return;
  }

  try {
    await http.post(ENDPOINTS.timers.stop, {
      timer_id: timerId,
      duration: durationMs,
    });
  } catch {
    return;
  }
}
