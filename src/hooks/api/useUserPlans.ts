import { useAuthTokenReady } from '@/providers/auth-token';
import { fetchUserPlans } from '@/services/plans';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useGuest } from '@/providers/guest';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useUserPlans(skip = 0, limit = 50) {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const language = useContentLanguage();
  const enabled = !!user && !isGuest && isAuthReady;

  return useQuery({
    queryKey: QUERY_KEYS.plans.userPlans(language, skip, limit),
    queryFn: () => fetchUserPlans(language, skip, limit),
    enabled,
  });
}
