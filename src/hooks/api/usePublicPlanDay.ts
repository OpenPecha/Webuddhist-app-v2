import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchPublicPlanDay } from '@/services/plans';
import { useQuery } from '@tanstack/react-query';

export function usePublicPlanDay(planId: string, dayNumber: number) {
  return useQuery({
    queryKey: QUERY_KEYS.plans.publicDay(planId, dayNumber),
    queryFn: () => fetchPublicPlanDay(planId, dayNumber),
    enabled: !!planId && dayNumber > 0,
  });
}
