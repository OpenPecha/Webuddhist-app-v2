import type { BookmarkDTO, BookmarkTab } from '@/types/bookmarks';

export function filterBookmarksByTab(
  bookmarks: BookmarkDTO[],
  tab: BookmarkTab,
): BookmarkDTO[] {
  switch (tab) {
    case 'all':
      return bookmarks;
    case 'plans':
      return bookmarks.filter((b) => b.type === 'PLAN' || b.type === 'SERIES');
    case 'mala':
      return bookmarks.filter((b) => b.type === 'ACCUMULATOR');
    case 'timers':
      return bookmarks.filter((b) => b.type === 'TIMER');
    case 'texts':
      return bookmarks.filter((b) => b.type === 'TEXT' || b.type === 'VERSE');
    default:
      return bookmarks;
  }
}

export const BOOKMARK_TABS: BookmarkTab[] = ['all', 'plans', 'mala', 'timers', 'texts'];
