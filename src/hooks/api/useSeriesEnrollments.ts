import { QUERY_KEYS } from '@/constants/query-keys';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import { fetchUserSeriesEnrollments } from '@/services/series';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';
import { getApiLanguageSync } from '@/lib/i18n';

export function useSeriesEnrollments(skip = 0, limit = 50) {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const language = useContentLanguage();
  const enabled = !!user && !isGuest && isAuthReady;

  return useQuery({
    queryKey: QUERY_KEYS.series.userEnrollments(language),
    queryFn: () => fetchUserSeriesEnrollments(getApiLanguageSync(), 'ACTIVE', skip, limit),
    enabled,
  });
}

export function useIsSeriesEnrolled(seriesId: string) {
  const { data, ...rest } = useSeriesEnrollments();
  const isEnrolled =
    data?.enrollments.some((e) => e.series_id === seriesId) ?? false;
  return { isEnrolled, ...rest };
}
