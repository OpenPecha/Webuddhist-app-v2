import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import { fetchSeriesDayCompleted } from '@/services/series-day-completed';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useSeriesDayCompleted(enabled = true, skip = 0, limit = 20) {
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const canFetch = !!user && !isGuest && isAuthReady && enabled;

  return useQuery({
    queryKey: QUERY_KEYS.profile.seriesDayCompleted(language, skip, limit),
    queryFn: () => fetchSeriesDayCompleted(language, skip, limit),
    enabled: canFetch,
    staleTime: 0,
  });
}
