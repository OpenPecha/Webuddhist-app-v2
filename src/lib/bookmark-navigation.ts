import { useRouter } from 'expo-router';
import type { BookmarkDTO } from '@/types/bookmarks';
import { showAppToast } from '@/utils/show-app-toast';

type AppRouter = ReturnType<typeof useRouter>;

export function isBookmarkTappable(bookmark: BookmarkDTO): boolean {
  if (bookmark.type === 'TIMER') {
    return (bookmark.timerDurationMs ?? 0) > 0;
  }
  return true;
}

export function navigateToBookmark(
  router: AppRouter,
  bookmark: BookmarkDTO,
  onError?: (message: string) => void,
): void {
  if (!isBookmarkTappable(bookmark)) return;

  switch (bookmark.type) {
    case 'TEXT':
    case 'VERSE': {
      const id = bookmark.textId ?? bookmark.sourceId;
      router.push({ pathname: '/reader/[textId]', params: { textId: id } });
      break;
    }
    case 'SERIES':
      router.push({ pathname: '/series/[id]', params: { id: bookmark.sourceId } });
      break;
    case 'PLAN':
      router.push({ pathname: '/plans/[id]', params: { id: bookmark.sourceId } });
      break;
    case 'TIMER':
      router.push({
        pathname: '/timers/active',
        params: {
          id: bookmark.sourceId,
          durationMs: String(bookmark.timerDurationMs ?? 0),
          name: bookmark.nestedTitle ?? bookmark.name ?? '',
        },
      });
      break;
    case 'ACCUMULATOR':
      router.push({
        pathname: '/mala',
        params: { initialPresetId: bookmark.sourceId },
      });
      break;
    default:
      onError?.('Unable to open bookmark');
      showAppToast('Unable to open bookmark');
  }
}
