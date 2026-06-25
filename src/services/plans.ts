import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import { resolveUserPlanForItem } from '@/utils/plan-utils';
import type {
  PlanDaysResponse,
  PublicPlanDayDetail,
  PublicPlanDetail,
} from '@/types/plan-catalog';
import type { UserPlanDayDetails, UserPlanProgress } from '@/types/plan-track';
import type { UserPlansResponse } from '@/types/plans';

export async function fetchPlanById(
  id: string,
  language = 'en',
): Promise<PublicPlanDetail> {
  const { data } = await http.get<PublicPlanDetail>(ENDPOINTS.plans.detail(id), {
    params: { language },
  });
  return data;
}

export async function fetchPlanDays(id: string): Promise<PlanDaysResponse> {
  const { data } = await http.get<PlanDaysResponse>(ENDPOINTS.plans.planDays(id));
  return data;
}

export async function fetchPublicPlanDay(
  planId: string,
  dayNumber: number,
): Promise<PublicPlanDayDetail> {
  const { data } = await http.get<PublicPlanDayDetail>(
    ENDPOINTS.plans.planDay(planId, dayNumber),
  );
  return data;
}

export async function enrollInPlan(planId: string): Promise<void> {
  await http.post(ENDPOINTS.plans.enroll, { plan_id: planId });
}

export async function checkUserPlanEnrolled(
  planId: string,
  language = 'en',
): Promise<boolean> {
  const response = await fetchUserPlans(language);
  return !!resolveUserPlanForItem(planId, response.plans);
}
export async function fetchUserPlans(
  language = 'en',
  skip = 0,
  limit = 50,
): Promise<UserPlansResponse> {
  const { data } = await http.get<UserPlansResponse>(ENDPOINTS.plans.userPlans, {
    params: { language, skip, limit },
  });
  return data;
}

export async function fetchUserPlanProgress(planId: string): Promise<UserPlanProgress> {
  const { data } = await http.get<UserPlanProgress>(ENDPOINTS.plans.userPlanProgress(planId));
  return data;
}

export async function fetchUserPlanDay(
  planId: string,
  dayNumber: number,
): Promise<UserPlanDayDetails> {
  const { data } = await http.get<UserPlanDayDetails>(
    ENDPOINTS.plans.userPlanDay(planId, dayNumber),
  );
  return data;
}

export async function fetchPlanCompletionStatus(
  planId: string,
): Promise<Record<number, boolean>> {
  const { data } = await http.get<{
    days: { day_number: number; is_completed: boolean }[];
  }>(ENDPOINTS.plans.completionStatus(planId));

  const status: Record<number, boolean> = {};
  for (const day of data.days) {
    status[day.day_number] = day.is_completed;
  }
  return status;
}

export async function completeTask(taskId: string): Promise<void> {
  await http.post(ENDPOINTS.plans.completeTask(taskId));
}

export async function completeSubTask(subTaskId: string): Promise<void> {
  await http.post(ENDPOINTS.plans.completeSubTask(subTaskId));
}
