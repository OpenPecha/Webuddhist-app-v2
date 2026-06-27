export type TimerType = 'preset' | 'user_created';

export interface PresetTimer {
  id: string;
  name: string;
  durationMs: number;
  audioUrl?: string | null;
  type?: TimerType;
}

export interface TimersResponse {
  timers: PresetTimer[];
  total: number;
}
