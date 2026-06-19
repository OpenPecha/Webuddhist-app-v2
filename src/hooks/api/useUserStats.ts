import { QUERY_KEYS } from '@/constants/query-keys';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import { fetchUserStats } from '@/services/user-stats';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useUserStats() {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const enabled = !!user && !isGuest && isAuthReady;

  return useQuery({
    queryKey: QUERY_KEYS.profile.stats(),
    queryFn: fetchUserStats,
    enabled,
    staleTime: 0,
    refetchOnMount: 'always',
    placeholderData: (previous) => previous,
  });
}
