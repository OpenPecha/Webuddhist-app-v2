import { QUERY_KEYS } from '@/constants/query-keys';
import { useAuthTokenReady } from '@/providers/auth-token';
import { fetchUserPlanDay, fetchUserPlanProgress } from '@/services/plans';
import { useGuest } from '@/providers/guest';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useUserPlanProgress(planId: string | undefined) {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();

  return useQuery({
    queryKey: QUERY_KEYS.plans.userPlanProgress(planId ?? ''),
    queryFn: () => fetchUserPlanProgress(planId!),
    enabled: !!planId && !!user && !isGuest && isAuthReady,
  });
}

export function useUserPlanDay(planId: string | undefined, dayNumber: number) {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();

  return useQuery({
    queryKey: QUERY_KEYS.plans.userPlanDay(planId ?? '', dayNumber),
    queryFn: () => fetchUserPlanDay(planId!, dayNumber),
    enabled: !!planId && dayNumber > 0 && !!user && !isGuest && isAuthReady,
  });
}
