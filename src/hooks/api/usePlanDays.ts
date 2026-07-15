import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchPlanDays } from '@/services/plans';
import { useQuery } from '@tanstack/react-query';

export function usePlanDays(planId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.plans.publicDays(planId),
    queryFn: () => fetchPlanDays(planId),
    enabled: !!planId,
  });
}
