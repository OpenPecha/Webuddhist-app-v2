import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { PresetTimer, TimerType } from '@/types/timers';
import { isTimerApiId } from '@/utils/timer-api';

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

export async function fetchPresetTimers(skip = 0, limit = 20): Promise<PresetTimer[]> {
  const { data } = await http.get<TimersResponseDto>(ENDPOINTS.timers.list, {
    params: { skip, limit },
  });

  return (data.timers ?? []).map(mapTimerDto).filter((timer) => timer.id.length > 0);
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
