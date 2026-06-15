import { fetchPlanCompletionStatus } from '@/services/plans';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

export function usePlanCompletionStatus(planId: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.plans.completionStatus(planId),
    queryFn: () => fetchPlanCompletionStatus(planId),
    enabled: enabled && !!planId,
  });
}
