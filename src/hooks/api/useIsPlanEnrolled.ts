import { useUserPlans } from '@/hooks/api/useUserPlans';
import { resolveUserPlanForItem } from '@/utils/plan-utils';
import { useGuest } from '@/providers/guest';
import { useMemo } from 'react';
import { useAuth0 } from 'react-native-auth0';

/** Flutter parity: enrolled when plan appears in GET /users/me/plans list. */
export function useIsPlanEnrolled(planId: string) {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { data, isLoading, isFetching, error, refetch } = useUserPlans();

  const isEnrolled = useMemo(() => {
    if (!user || isGuest || !planId) return false;
    return !!resolveUserPlanForItem(planId, data?.plans ?? []);
  }, [user, isGuest, planId, data?.plans]);

  return {
    data: isEnrolled,
    isLoading: !!user && !isGuest && isLoading,
    isFetching,
    error,
    refetch,
  };
}
