import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import { resolveUserPlanForItem } from '@/utils/plan-utils';
import type {
  PlanDaysResponse,
  PublicPlanDayDetail,
  PublicPlanDetail,
  PublicPlansResponse,
} from '@/types/plan-catalog';
import type { UserPlanDayDetails, UserPlanProgress } from '@/types/plan-track';
import type { UserPlansResponse } from '@/types/plans';

export const PLANS_CATALOG_PAGE_SIZE = 20;

export async function fetchPlans(
  language = 'en',
  skip = 0,
  limit = PLANS_CATALOG_PAGE_SIZE,
  search?: string,
): Promise<PublicPlansResponse> {
  const params: Record<string, string | number> = {
    language,
    skip,
    limit,
  };
  if (search?.trim()) params.search = search.trim();

  const { data } = await http.get<PublicPlansResponse>(ENDPOINTS.plans.list, { params });
  return data;
}

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
  seriesId?: string,
): Promise<UserPlansResponse> {
  const { data } = await http.get<UserPlansResponse>(ENDPOINTS.plans.userPlans, {
    params: {
      language,
      skip,
      limit,
      ...(seriesId ? { series_id: seriesId } : {}),
    },
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

/** Uncompletes a task. Mirrors the Flutter app's "uncheck" behavior. */
export async function deleteTask(taskId: string): Promise<void> {
  await http.delete(ENDPOINTS.plans.deleteTask(taskId));
}

export async function completeSubTask(subTaskId: string): Promise<void> {
  await http.post(ENDPOINTS.plans.completeSubTask(subTaskId));
}
