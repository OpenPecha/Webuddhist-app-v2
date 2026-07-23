import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchMalaPresets } from '@/services/mala/accumulators';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';
import { useGuest } from '@/providers/guest';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useAppLanguage } from '@/lib/tolgee';

export function useMalaPresets() {
  const language = useAppLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();

  return useQuery({
    queryKey: QUERY_KEYS.mala.presets(language),
    queryFn: () => fetchMalaPresets(language),
    enabled: !!user && !isGuest && isAuthReady,
  });
}
