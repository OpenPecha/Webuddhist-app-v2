import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { RoutineInfo } from '@/types/routine-info';

interface RoutineInfoResponse {
  series_count?: number;
  recitation_count?: number;
}

export async function fetchRoutineInfo(): Promise<RoutineInfo> {
  const { data } = await http.get<RoutineInfoResponse>(ENDPOINTS.users.routineInfo);
  return {
    seriesCount: data.series_count ?? 0,
    recitationCount: data.recitation_count ?? 0,
  };
}
