import { useAuthTokenReady } from '@/providers/auth-token';
import { fetchUserPlans } from '@/services/plans';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useGuest } from '@/providers/guest';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from 'react-native-auth0';

export function useUserPlans(skip = 0, limit = 50) {
  const { i18n } = useTranslation();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const language = i18n.language;
  const enabled = !!user && !isGuest && isAuthReady;

  return useQuery({
    queryKey: QUERY_KEYS.plans.userPlans(language, skip, limit),
    queryFn: () => fetchUserPlans(language, skip, limit),
    enabled,
  });
}
