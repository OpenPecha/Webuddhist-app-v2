import { FALLBACK_PRESET_TIMERS, filterMeditationPresets } from '@/constants/timer-presets';
import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { PresetTimer, TimersResponse } from '@/types/timers';

export async function fetchPresetTimers(skip = 0, limit = 20): Promise<PresetTimer[]> {
  try {
    const { data } = await http.get<TimersResponse>(ENDPOINTS.timers.list, {
      params: { skip, limit },
    });
    const timers = (data.timers ?? []).map((timer) => ({
      id: timer.id ?? '',
      name: timer.name ?? '',
      durationMs: (timer as { duration?: number }).duration ?? timer.durationMs ?? 0,
      audioUrl: timer.audioUrl ?? null,
    }));
    const filtered = filterMeditationPresets(timers.length > 0 ? timers : FALLBACK_PRESET_TIMERS);
    return logPresetTimersResult('api', filtered);
  } catch {
    return logPresetTimersResult('fallback-catch', FALLBACK_PRESET_TIMERS);
  }
}

async function logPresetTimersResult(source: string, presets: PresetTimer[]): Promise<PresetTimer[]> {
  // #region agent log
  fetch('http://127.0.0.1:7544/ingest/57328dfe-8256-4e2a-91e6-138b7c8b37e5', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '3a2ae6' },
    body: JSON.stringify({
      sessionId: '3a2ae6',
      runId: 'pre-fix',
      hypothesisId: 'H1',
      location: 'timers.ts:fetchPresetTimers',
      message: 'preset timers loaded',
      data: {
        source,
        count: presets.length,
        ids: presets.map((p) => p.id),
        durationsMin: presets.map((p) => Math.round(p.durationMs / 60000)),
        hasFallbackIds: presets.some((p) => p.id.startsWith('preset-')),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  return presets;
}

/** Reports elapsed meditation time — fire-and-forget, mirrors Flutter stopUserTimer. */
export async function stopUserTimer(timerId: string, durationMs: number): Promise<void> {
  const isFallbackId = timerId.startsWith('preset-');
  // #region agent log
  fetch('http://127.0.0.1:7544/ingest/57328dfe-8256-4e2a-91e6-138b7c8b37e5', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '3a2ae6' },
    body: JSON.stringify({
      sessionId: '3a2ae6',
      runId: 'pre-fix',
      hypothesisId: 'H1-H2',
      location: 'timers.ts:stopUserTimer:entry',
      message: 'stopUserTimer called',
      data: { timerId, durationMs, isFallbackId, timerIdEmpty: timerId.length === 0 },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  try {
    const response = await http.post(ENDPOINTS.timers.stop, {
      timer_id: timerId,
      duration: durationMs,
    });
    // #region agent log
    fetch('http://127.0.0.1:7544/ingest/57328dfe-8256-4e2a-91e6-138b7c8b37e5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '3a2ae6' },
      body: JSON.stringify({
        sessionId: '3a2ae6',
        runId: 'pre-fix',
        hypothesisId: 'H5',
        location: 'timers.ts:stopUserTimer:success',
        message: 'stopUserTimer succeeded',
        data: { status: response.status, timerId },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  } catch (error) {
    const axiosError = error as {
      name?: string;
      message?: string;
      response?: { status?: number; data?: unknown };
    };
    // #region agent log
    fetch('http://127.0.0.1:7544/ingest/57328dfe-8256-4e2a-91e6-138b7c8b37e5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '3a2ae6' },
      body: JSON.stringify({
        sessionId: '3a2ae6',
        runId: 'pre-fix',
        hypothesisId: 'H1-H4',
        location: 'timers.ts:stopUserTimer:error',
        message: 'stopUserTimer failed',
        data: {
          errorName: axiosError.name,
          errorMessage: axiosError.message,
          status: axiosError.response?.status ?? null,
          responseData: axiosError.response?.data ?? null,
          timerId,
          durationMs,
          isFallbackId,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    console.warn('[timers] Failed to report timer stop:', error);
  }
}
