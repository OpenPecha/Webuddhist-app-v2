export interface PresetTimer {
  id: string;
  name: string;
  durationMs: number;
  audioUrl?: string | null;
}

export interface TimersResponse {
  timers: PresetTimer[];
  total: number;
}
