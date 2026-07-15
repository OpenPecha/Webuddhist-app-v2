import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { PresetTimer, TimerType } from '@/types/timers';

/** Meditation preset catalogue is small; no infinite scroll yet. */
export const PRESET_TIMERS_FETCH_LIMIT = 50;

interface TimerDto {
  id?: string;
  name?: string;
  duration?: number;
  audio_url?: string | null;
  type?: TimerType;
  description?: string | null;
}

interface TimersResponseDto {
  timers?: TimerDto[];
  total?: number;
  skip?: number;
  limit?: number;
}

function mapTimerDto(dto: TimerDto): PresetTimer {
  return {
    id: dto.id ?? '',
    name: dto.name ?? '',
    durationMs: dto.duration ?? 0,
    audioUrl: dto.audio_url ?? null,
    type: dto.type,
  };
}

export async function fetchPresetTimers(): Promise<PresetTimer[]> {
  const { data } = await http.get<TimersResponseDto>(ENDPOINTS.timers.list, {
    params: { skip: 0, limit: PRESET_TIMERS_FETCH_LIMIT },
  });

  return (data.timers ?? []).map(mapTimerDto).filter((timer) => timer.id.length > 0);
}

/** Reports elapsed meditation time — fire-and-forget, mirrors Flutter stopUserTimer. */
export async function stopUserTimer(timerId: string, durationMs: number): Promise<void> {
  if (!timerId) return;

  try {
    await http.post(ENDPOINTS.timers.stop, {
      timer_id: timerId,
      duration: durationMs,
    });
  } catch {
    return;
  }
}
