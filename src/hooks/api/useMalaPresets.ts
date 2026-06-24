import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchMalaPresets } from '@/services/mala/accumulators';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from 'react-native-auth0';
import { useGuest } from '@/providers/guest';
import { useAuthTokenReady } from '@/providers/auth-token';

export function useMalaPresets() {
  const { i18n } = useTranslation();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const language = i18n.language.split('-')[0] ?? 'en';

  return useQuery({
    queryKey: QUERY_KEYS.mala.presets(language),
    queryFn: () => fetchMalaPresets(language),
    enabled: !!user && !isGuest && isAuthReady,
  });
}
