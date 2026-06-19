import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { StreakStats, UserStats } from '@/types/user-stats';
import { EMPTY_USER_STATS } from '@/types/user-stats';

interface StreakStatsJson {
  current?: number;
  highest?: number;
  week?: number[];
}

interface UserStatsJson {
  streak?: StreakStatsJson;
  total_timer?: number;
  total_accumulated?: number;
  total_practice_days?: number;
}

function parseStreakStats(data?: StreakStatsJson): StreakStats {
  return {
    current: data?.current ?? 0,
    highest: data?.highest ?? 0,
    week: data?.week ?? [],
  };
}

export function parseUserStats(data: UserStatsJson): UserStats {
  if (!data) return EMPTY_USER_STATS;
  return {
    streak: parseStreakStats(data.streak),
    totalTimer: data.total_timer ?? 0,
    totalAccumulated: data.total_accumulated ?? 0,
    totalPracticeDays: data.total_practice_days ?? 0,
  };
}

export async function fetchUserStats(): Promise<UserStats> {
  const { data } = await http.get<UserStatsJson>(ENDPOINTS.users.stats);
  return parseUserStats(data);
}
