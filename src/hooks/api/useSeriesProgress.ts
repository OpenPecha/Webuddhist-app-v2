import { QUERY_KEYS } from '@/constants/query-keys';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import { fetchUserSeriesProgress } from '@/services/series';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useSeriesProgress(seriesId: string, enabled = true) {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const language = useContentLanguage();
  const isEnabled = !!user && !isGuest && isAuthReady && !!seriesId && enabled;

  return useQuery({
    queryKey: QUERY_KEYS.series.userProgress(seriesId, language),
    queryFn: () => fetchUserSeriesProgress(seriesId, language),
    enabled: isEnabled,
  });
}
