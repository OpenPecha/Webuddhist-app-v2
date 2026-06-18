import { QUERY_KEYS } from '@/constants/query-keys';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import { fetchUserProfile } from '@/services/user';
import { StorageKeys, setString } from '@/lib/storage';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useUserProfile() {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const enabled = !!user && !isGuest && isAuthReady;

  return useQuery({
    queryKey: QUERY_KEYS.profile.info(),
    queryFn: async () => {
      const profile = await fetchUserProfile();
      await setString(StorageKeys.profileData, JSON.stringify(profile));
      await setString(StorageKeys.lastProfileUpdate, new Date().toISOString());
      return profile;
    },
    enabled,
    staleTime: 0,
    placeholderData: (previous) => previous,
  });
}
