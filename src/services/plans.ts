import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { UserPlansResponse } from '@/types/plans';

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
