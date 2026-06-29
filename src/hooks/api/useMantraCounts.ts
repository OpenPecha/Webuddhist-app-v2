import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import { fetchMantraCounts } from '@/services/mantra-counts';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useMantraCounts(enabled = true, skip = 0, limit = 20) {
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const canFetch = !!user && !isGuest && isAuthReady && enabled;

  return useQuery({
    queryKey: QUERY_KEYS.profile.mantraCounts(language, skip, limit),
    queryFn: () => fetchMantraCounts(language, skip, limit),
    enabled: canFetch,
    staleTime: 0,
  });
}
