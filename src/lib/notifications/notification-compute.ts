import { SCHEDULE_PLAN_NOTIFICATIONS } from '@/constants/app-feature-flags';
import {
  SPECIAL_PLAN_NOTIFICATIONS,
  isSpecialPlan,
} from '@/constants/special-plan-notifications';
import type { DesiredNotification } from '@/lib/notifications/desired-notification';
import {
  MAX_TOTAL_SCHEDULED,
  PLAN_SERIES_MAX_SCHEDULED_DAYS,
} from '@/lib/notifications/desired-notification';
import {
  planOneShotId,
  planSeriesId,
  specialPlanOneShotId,
  specialPlanSeriesId,
} from '@/lib/notifications/notification-id-scheme';
import { encodeRoutinePayload } from '@/lib/notifications/notification-payload';
import {
  addDays,
  routineBlockNotificationId,
  startOfDay,
  timeIntToHourMinute,
} from '@/lib/notifications/routine-block-utils';
import {
  buildUpcomingSeriesSlots,
  planStartDay,
  resolveActivePlanForDate,
} from '@/lib/notifications/series-plan-schedule';
import type { RoutineBlock, RoutineItem } from '@/types/routine';
import type { UserPlan } from '@/types/plans';
import { dayNumberFor, getEffectiveStartDate } from '@/utils/plan-utils';

export function planDayBody(planTitle: string, day: number, totalDays: number): string {
  return `Day ${day} of ${totalDays} — check out ${planTitle}.`;
}

function fireAtForDate(hour: number, minute: number, date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0, 0);
}

function recitationBody(block: RoutineBlock): string {
  if (block.items.length === 0) return 'Check your daily routine';
  const firstItem = block.items[0].title;
  const remaining = block.items.length - 1;
  if (remaining === 1) return `${firstItem} and 1 other`;
  if (remaining > 1) return `${firstItem} and ${remaining} others`;
  return firstItem;
}

export function computeForRecitationBlock(
  block: RoutineBlock,
  now: Date,
  options: { masterOn: boolean; recitationOn: boolean },
): DesiredNotification[] {
  if (!options.masterOn || !options.recitationOn) return [];
  if (block.items.length === 0 || !block.notificationEnabled) return [];

  const firstItem = block.items[0];
  const { hour, minute } = timeIntToHourMinute(block.timeInt);
  let scheduledDate = fireAtForDate(hour, minute, now);
  if (scheduledDate.getTime() <= now.getTime()) {
    scheduledDate = addDays(scheduledDate, 1);
  }

  return [
    {
      id: routineBlockNotificationId(block.id),
      fireAt: scheduledDate,
      title: firstItem.title,
      body: recitationBody(block),
      payload: encodeRoutinePayload(firstItem.id, firstItem.type),
      sourceItem: firstItem,
      isDailyRepeat: true,
      debugCase: '4 daily-repeat',
    },
  ];
}

export function computeForPlanBlock(
  block: RoutineBlock,
  item: RoutineItem,
  plan: UserPlan,
  now: Date,
  options: {
    masterOn: boolean;
    routineOn: boolean;
    seriesScheduledTodayByOS?: boolean;
  },
): DesiredNotification[] {
  if (!options.masterOn || !options.routineOn) return [];
  if (block.items.length === 0 || !block.notificationEnabled) return [];

  const entries: DesiredNotification[] = [];
  const specialEntries = SPECIAL_PLAN_NOTIFICATIONS[plan.id];
  const isSpecial = isSpecialPlan(plan.id);
  const anchorDay = planStartDay(plan);
  const today = startOfDay(now);
  const daysSinceAnchor = Math.floor((today.getTime() - anchorDay.getTime()) / 86_400_000);
  const totalDays = plan.total_days;
  const planEndDay = addDays(anchorDay, totalDays - 1);

  if (today.getTime() > planEndDay.getTime()) return [];

  const { hour, minute } = timeIntToHourMinute(block.timeInt);
  const seriesStart = fireAtForDate(hour, minute, anchorDay);
  const payload = encodeRoutinePayload(item.id, item.type, plan.id);

  let scheduledCount = 0;
  for (let day = 1; day <= totalDays; day++) {
    if (scheduledCount >= PLAN_SERIES_MAX_SCHEDULED_DAYS) break;
    const fireDate = addDays(seriesStart, day - 1);
    const fireWall = addDays(fireAtForDate(hour, minute, anchorDay), day - 1);
    if (fireWall.getTime() <= now.getTime()) continue;

    let title: string;
    let body: string;
    let debugCase: string;

    if (isSpecial && specialEntries) {
      if (day <= specialEntries.length) {
        const content = specialEntries[day - 1];
        title = content.title;
        body = content.body;
        debugCase = '2a';
      } else if (day <= totalDays) {
        title = item.title;
        body = planDayBody(item.title, day, totalDays);
        debugCase = '2b';
      } else {
        continue;
      }
    } else {
      if (!SCHEDULE_PLAN_NOTIFICATIONS) continue;
      title = item.title;
      body = planDayBody(item.title, day, totalDays);
      debugCase = today.getTime() < anchorDay.getTime() ? '3a' : '3b';
    }

    const id =
      isSpecial && specialEntries && day <= specialEntries.length
        ? specialPlanSeriesId(plan.id, day)
        : planSeriesId(plan.id, day);

    entries.push({
      id,
      fireAt: fireDate,
      title,
      body,
      payload,
      sourceItem: item,
      enrollmentPlanId: plan.id,
      debugCase,
    });
    scheduledCount++;
  }

  if (today.getTime() >= anchorDay.getTime() && daysSinceAnchor < totalDays) {
    const todayFireWall = addDays(fireAtForDate(hour, minute, anchorDay), daysSinceAnchor);
    const isPast = todayFireWall.getTime() <= now.getTime();
    const dayNumber = daysSinceAnchor + 1;

    if (isPast && options.seriesScheduledTodayByOS) {
      return entries;
    }

    if (isPast) {
      let title: string;
      let body: string;
      let id: number;

      if (isSpecial && specialEntries && dayNumber <= specialEntries.length) {
        const content = specialEntries[dayNumber - 1];
        title = content.title;
        body = content.body;
        id = specialPlanOneShotId(dayNumber);
      } else if (SCHEDULE_PLAN_NOTIFICATIONS || isSpecial) {
        title = plan.title;
        body = planDayBody(plan.title, dayNumber, totalDays);
        id = planOneShotId(plan.id);
      } else {
        return entries;
      }

      entries.push({
        id,
        fireAt: null,
        title,
        body,
        payload,
        sourceItem: item,
        enrollmentPlanId: plan.id,
        isImmediate: true,
        debugCase: '3b immediate-catchup',
      });
    }
  }

  return entries;
}

export function computeForSeriesBlock(
  block: RoutineBlock,
  seriesItem: RoutineItem,
  seriesPlans: UserPlan[],
  now: Date,
  options: {
    masterOn: boolean;
    routineOn: boolean;
    seriesScheduledTodayByOS?: boolean;
  },
): DesiredNotification[] {
  if (!options.masterOn || !options.routineOn) return [];
  if (block.items.length === 0 || !block.notificationEnabled || seriesPlans.length === 0) return [];

  const entries: DesiredNotification[] = [];
  const today = startOfDay(now);
  const { hour, minute } = timeIntToHourMinute(block.timeInt);

  const slots = buildUpcomingSeriesSlots({
    enrolledPlans: seriesPlans,
    now,
    maxSlots: PLAN_SERIES_MAX_SCHEDULED_DAYS,
    preferredPlanIdForToday: seriesItem.currentPlanId,
  });

  for (const slot of slots) {
    const { plan, dayNumber, calendarDate } = slot;
    const fireWall = fireAtForDate(hour, minute, calendarDate);
    if (fireWall.getTime() <= now.getTime()) continue;

    const isSpecial = isSpecialPlan(plan.id);
    const specialEntries = SPECIAL_PLAN_NOTIFICATIONS[plan.id];
    let title: string;
    let body: string;
    let debugCase: string;

    if (isSpecial && specialEntries && dayNumber <= specialEntries.length) {
      const content = specialEntries[dayNumber - 1];
      title = content.title;
      body = content.body;
      debugCase = '2a';
    } else {
      if (!SCHEDULE_PLAN_NOTIFICATIONS && !isSpecial) continue;
      title = plan.title;
      body = planDayBody(plan.title, dayNumber, plan.total_days);
      debugCase = calendarDate.getTime() > today.getTime() ? '3a' : '3b';
    }

    const id =
      isSpecial && specialEntries && dayNumber <= specialEntries.length
        ? specialPlanSeriesId(plan.id, dayNumber)
        : planSeriesId(plan.id, dayNumber);

    entries.push({
      id: id,
      fireAt: fireWall,
      title,
      body,
      payload: encodeRoutinePayload(seriesItem.id, seriesItem.type, plan.id),
      sourceItem: seriesItem,
      enrollmentPlanId: plan.id,
      debugCase,
    });
  }

  const todayPlan = resolveActivePlanForDate(seriesPlans, today, seriesItem.currentPlanId);
  if (todayPlan) {
    const dayNumber = dayNumberFor(
      getEffectiveStartDate(todayPlan),
      today,
      todayPlan.total_days,
    );
    if (dayNumber >= 1) {
      const todayFireWall = fireAtForDate(hour, minute, today);
      const isPast = todayFireWall.getTime() <= now.getTime();
      if (isPast && options.seriesScheduledTodayByOS) {
        return entries;
      }
      if (isPast) {
        const isSpecial = isSpecialPlan(todayPlan.id);
        const specialEntries = SPECIAL_PLAN_NOTIFICATIONS[todayPlan.id];
        let title: string;
        let body: string;
        let id: number;

        if (isSpecial && specialEntries && dayNumber <= specialEntries.length) {
          const content = specialEntries[dayNumber - 1];
          title = content.title;
          body = content.body;
          id = specialPlanOneShotId(dayNumber);
        } else if (SCHEDULE_PLAN_NOTIFICATIONS || isSpecial) {
          title = todayPlan.title;
          body = planDayBody(todayPlan.title, dayNumber, todayPlan.total_days);
          id = planOneShotId(todayPlan.id);
        } else {
          return entries;
        }

        entries.push({
          id,
          fireAt: null,
          title,
          body,
          payload: encodeRoutinePayload(seriesItem.id, seriesItem.type, todayPlan.id),
          sourceItem: seriesItem,
          enrollmentPlanId: todayPlan.id,
          isImmediate: true,
          debugCase: '3b immediate-catchup',
        });
      }
    }
  }

  return entries;
}

export function applyGlobalCap(desired: Map<number, DesiredNotification>): void {
  const reserved = [...desired.values()].filter((d) => d.isDailyRepeat || d.isImmediate).length;
  const dated = [...desired.values()]
    .filter((d) => !d.isDailyRepeat && !d.isImmediate && d.fireAt)
    .sort((a, b) => a.fireAt!.getTime() - b.fireAt!.getTime());
  const budget = MAX_TOTAL_SCHEDULED - reserved;
  if (dated.length <= budget) return;
  for (const entry of dated.slice(budget < 0 ? 0 : budget)) {
    desired.delete(entry.id);
  }
}
