import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { ConflictFailure } from '@/lib/api-error';
import {
  checkBookmarkExists,
  createBookmark,
  deleteBookmark,
  findBookmarkInList,
} from '@/services/bookmarks';
import type { BookmarkCreateType, BookmarkDTO, BookmarkExistsResult } from '@/types/bookmarks';
import { appT } from '@/lib/tolgee';
import { showAppToast } from '@/utils/show-app-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface ToggleBookmarkInput {
  type: BookmarkCreateType;
  sourceId: string;
  name?: string;
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const language = useContentLanguage();

  return useMutation({
    mutationFn: async ({ type, sourceId, name }: ToggleBookmarkInput) => {
      const existsKey = QUERY_KEYS.bookmarks.exists(sourceId, type);
      const previous =
        queryClient.getQueryData<BookmarkExistsResult>(existsKey) ??
        (await checkBookmarkExists(sourceId, type));

      queryClient.setQueryData<BookmarkExistsResult>(existsKey, {
        exists: !previous.exists,
        id: previous.exists ? previous.id : null,
      });

      try {
        if (previous.exists) {
          let bookmarkId = previous.id;
          if (!bookmarkId) {
            const resolved = await checkBookmarkExists(sourceId, type);
            bookmarkId = resolved.id ?? undefined;
          }
          if (!bookmarkId) {
            const list = queryClient.getQueryData<BookmarkDTO[]>(
              QUERY_KEYS.bookmarks.list(language),
            );
            bookmarkId = list ? findBookmarkInList(list, type, sourceId)?.id : undefined;
          }
          if (bookmarkId) {
            await deleteBookmark(bookmarkId);
          }
        } else {
          await createBookmark(type, sourceId, name);
          const resolved = await checkBookmarkExists(sourceId, type);
          queryClient.setQueryData<BookmarkExistsResult>(existsKey, resolved);
        }

        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarks.all });
        return !previous.exists;
      } catch (error) {
        queryClient.setQueryData(existsKey, previous);
        if (error instanceof ConflictFailure) {
          queryClient.setQueryData<BookmarkExistsResult>(existsKey, {
            exists: true,
            id: previous.id,
          });
          await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarks.all });
          return true;
        }
        showAppToast(
          previous.exists ? appT('bookmark_remove_failed') : appT('bookmark_save_failed'),
        );
        throw error;
      }
    },
    onSuccess: (saved) => {
      showAppToast(saved ? appT('bookmark_saved') : appT('bookmark_removed'));
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  const language = useContentLanguage();

  return useMutation({
    mutationFn: async (input: {
      bookmarkId: string;
      sourceId?: string;
      type?: BookmarkCreateType;
    }) => {
      const listKey = QUERY_KEYS.bookmarks.list(language);
      const previous = queryClient.getQueryData<BookmarkDTO[]>(listKey);

      if (previous) {
        queryClient.setQueryData(
          listKey,
          previous.filter((b) => b.id !== input.bookmarkId),
        );
      }

      try {
        await deleteBookmark(input.bookmarkId);
        if (input.sourceId && input.type) {
          queryClient.setQueryData<BookmarkExistsResult>(
            QUERY_KEYS.bookmarks.exists(input.sourceId, input.type),
            { exists: false, id: null },
          );
        }
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarks.all });
      } catch {
        if (previous) queryClient.setQueryData(listKey, previous);
        showAppToast(appT('bookmark_remove_failed'));
        throw new Error('remove failed');
      }
    },
    onSuccess: () => {
      showAppToast(appT('bookmark_removed'));
    },
  });
}
