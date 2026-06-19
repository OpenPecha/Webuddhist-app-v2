export interface StreakStats {
  current: number;
  highest: number;
  week: number[];
}

export interface UserStats {
  streak: StreakStats;
  totalTimer: number;
  totalAccumulated: number;
  totalPracticeDays: number;
}

export const EMPTY_USER_STATS: UserStats = {
  streak: { current: 0, highest: 0, week: [] },
  totalTimer: 0,
  totalAccumulated: 0,
  totalPracticeDays: 0,
};
