import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchMalaPresets } from '@/services/mala/accumulators';
import { useQuery } from '@tanstack/react-query';
import { getApiLanguageSync, useUiLanguage } from '@/lib/i18n';
import { useAuth0 } from 'react-native-auth0';
import { useGuest } from '@/providers/guest';
import { useAuthTokenReady } from '@/providers/auth-token';

export function useMalaPresets() {
  const language = useUiLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();

  return useQuery({
    queryKey: QUERY_KEYS.mala.presets(language),
    queryFn: () => fetchMalaPresets(getApiLanguageSync()),
    enabled: !!user && !isGuest && isAuthReady,
  });
}
