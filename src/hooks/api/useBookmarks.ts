import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import { fetchAllBookmarks } from '@/services/bookmarks';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useBookmarks() {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const language = useContentLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.bookmarks.list(language),
    queryFn: () => fetchAllBookmarks(language),
    enabled: !!user && !isGuest && isAuthReady,
  });
}
