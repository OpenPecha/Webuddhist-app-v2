import { QUERY_KEYS } from '@/constants/query-keys';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import { checkBookmarkExists } from '@/services/bookmarks';
import type { BookmarkCreateType } from '@/types/bookmarks';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useBookmarkExists(
  sourceId: string,
  type: BookmarkCreateType,
  enabled = true,
) {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();

  return useQuery({
    queryKey: QUERY_KEYS.bookmarks.exists(sourceId, type),
    queryFn: () => checkBookmarkExists(sourceId, type),
    enabled: enabled && !!sourceId && !!user && !isGuest && isAuthReady,
    staleTime: 30_000,
  });
}

export function useIsBookmarked(
  sourceId: string,
  type: BookmarkCreateType,
  enabled = true,
) {
  const query = useBookmarkExists(sourceId, type, enabled);
  return {
    ...query,
    isBookmarked: query.data?.exists ?? false,
    bookmarkId: query.data?.id ?? null,
  };
}
