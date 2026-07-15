import { QUERY_KEYS } from '@/constants/query-keys';
import { loadCachedUserProfile, saveCachedUserProfile } from '@/lib/profile-cache';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import { fetchUserProfile } from '@/services/user';
import type { UserProfile } from '@/types/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth0 } from 'react-native-auth0';

export function useUserProfile() {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const queryClient = useQueryClient();
  const enabled = !!user && !isGuest && isAuthReady;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    loadCachedUserProfile().then((cached) => {
      if (cancelled || !cached) return;
      const existing = queryClient.getQueryData<UserProfile>(QUERY_KEYS.profile.info());
      if (!existing) {
        queryClient.setQueryData(QUERY_KEYS.profile.info(), cached);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, queryClient]);

  return useQuery({
    queryKey: QUERY_KEYS.profile.info(),
    queryFn: async () => {
      const profile = await fetchUserProfile();
      await saveCachedUserProfile(profile);
      return profile;
    },
    enabled,
    staleTime: 0,
    refetchOnMount: 'always',
    placeholderData: (previous) => previous,
  });
}
