import { QUERY_KEYS } from '@/constants/query-keys';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import { fetchRoutineInfo } from '@/services/routine-info';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useRoutineInfo() {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const enabled = !!user && !isGuest && isAuthReady;

  return useQuery({
    queryKey: QUERY_KEYS.routineInfo.me(),
    queryFn: fetchRoutineInfo,
    enabled,
  });
}
