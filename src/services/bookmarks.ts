import { ENDPOINTS } from '@/lib/api-config';
import { ConflictFailure } from '@/lib/api-error';
import { http } from '@/lib/http';
import type {
  BookmarkCreateType,
  BookmarkDTO,
  BookmarkExistsResult,
} from '@/types/bookmarks';
import { parseBookmarkDto, parseBookmarksResponse } from '@/types/bookmarks';

const PAGE_SIZE = 50;

export async function createBookmark(
  type: BookmarkCreateType,
  sourceId: string,
  name?: string,
): Promise<boolean> {
  try {
    const { status } = await http.post(ENDPOINTS.bookmarks.create, {
      type,
      source_id: sourceId,
      ...(name?.trim() ? { name: name.trim() } : {}),
    });
    return status === 200 || status === 201;
  } catch (error) {
    if (error instanceof ConflictFailure) return true;
    throw error;
  }
}

export async function fetchAllBookmarks(language?: string): Promise<BookmarkDTO[]> {
  const all: BookmarkDTO[] = [];
  let skip = 0;

  while (true) {
    const { data } = await http.get<Record<string, unknown>>(ENDPOINTS.bookmarks.list, {
      params: {
        skip,
        limit: PAGE_SIZE,
        ...(language ? { language } : {}),
      },
    });
    const page = parseBookmarksResponse(data);
    all.push(...page.bookmarks);
    skip += PAGE_SIZE;

    if (
      page.bookmarks.length === 0 ||
      page.bookmarks.length < PAGE_SIZE ||
      all.length >= page.total
    ) {
      break;
    }
  }

  return all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function checkBookmarkExists(
  sourceId: string,
  type?: BookmarkCreateType,
): Promise<BookmarkExistsResult> {
  const { data } = await http.get<Record<string, unknown>>(ENDPOINTS.bookmarks.exists, {
    params: {
      source_id: sourceId,
      ...(type ? { type } : {}),
    },
  });
  return {
    exists: Boolean(data.exists),
    id: (data.id as string | undefined) ?? null,
  };
}

export async function deleteBookmark(bookmarkId: string): Promise<void> {
  await http.delete(ENDPOINTS.bookmarks.delete(bookmarkId));
}

export function findBookmarkInList(
  bookmarks: BookmarkDTO[],
  type: BookmarkCreateType,
  sourceId: string,
): BookmarkDTO | undefined {
  return bookmarks.find((b) => {
    const createType =
      b.type === 'TEXT'
        ? 'TEXT'
        : b.type === 'VERSE'
          ? 'VERSE'
          : b.type === 'SERIES'
            ? 'SERIES'
            : b.type === 'ACCUMULATOR'
              ? 'ACCUMULATOR'
              : b.type === 'TIMER'
                ? 'TIMER'
                : null;
    return createType === type && b.sourceId === sourceId;
  });
}
