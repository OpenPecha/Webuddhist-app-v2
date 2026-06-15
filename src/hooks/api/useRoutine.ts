import { useAuthTokenReady } from '@/providers/auth-token';
import { fetchUserRoutine } from '@/services/routine';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useGuest } from '@/providers/guest';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useRoutine(skip = 0, limit = 20) {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const enabled = !!user && !isGuest && isAuthReady;

  return useQuery({
    queryKey: QUERY_KEYS.routine.user(skip, limit),
    queryFn: () => fetchUserRoutine(skip, limit),
    enabled,
  });
}
