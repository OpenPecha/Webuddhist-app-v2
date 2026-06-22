/** Special-plan Day-1 notification content — mirrors Flutter `special_plan_notifications.dart`. */

export const ITCC_PLAN_ID = 'b42c9270-8bc9-4a98-b375-924a948ab18e';
export const ITCC_PLAN_7TO37_ID = '509657b5-7af5-45de-b22d-0ea2fe094424';

export interface DayNotification {
  title: string;
  body: string;
  buttonText?: string;
}

export const SPECIAL_PLAN_NOTIFICATIONS: Record<string, DayNotification[]> = {
  [ITCC_PLAN_ID]: [
    {
      title: 'Welcome to the course',
      body: "Your journey to Bodhgaya begins today. If you haven't already started, jump right in.",
    },
    {
      title: 'ITCC: Days 1-6',
      body: "Welcome to day 2. Yesterday we mapped the universe of phenomena using groups of three. Today look at phenomena as dualities like conditioned and unconditioned.",
      buttonText: 'START',
    },
  ],
  [ITCC_PLAN_7TO37_ID]: [
    {
      title: 'Welcome to ITCC: Days 7-37',
      body: 'Today we begin Cittuppādakaṇḍaṃ, the Chapter on the Arising of Consciousness and look at the mind when something wholesome arises.',
      buttonText: 'Read Now',
    },
  ],
};

export function isSpecialPlan(planId: string): boolean {
  return planId in SPECIAL_PLAN_NOTIFICATIONS;
}

export function daysSinceEnrollment(startedAt: string, now = new Date()): number {
  const start = new Date(startedAt);
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - startDay.getTime()) / (24 * 60 * 60 * 1000));
}

export function notificationContentForPlan(
  planId: string,
  dayNumber: number,
): DayNotification | null {
  const entries = SPECIAL_PLAN_NOTIFICATIONS[planId];
  if (!entries || dayNumber < 1 || dayNumber > entries.length) return null;
  return entries[dayNumber - 1];
}
