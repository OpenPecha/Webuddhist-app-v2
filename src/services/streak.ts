import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';

interface StreakResponse {
  streak: number;
}

export async function fetchStreak(): Promise<number> {
  const { data } = await http.get<StreakResponse>(ENDPOINTS.users.streak);
  return data.streak ?? 0;
}
