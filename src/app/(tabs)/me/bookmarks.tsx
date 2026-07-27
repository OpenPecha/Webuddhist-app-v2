import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { BookmarkCard } from '@/components/bookmarks/BookmarkCard';
import { BookmarkListSkeleton } from '@/components/bookmarks/BookmarkListSkeleton';
import { useBookmarks } from '@/hooks/api/useBookmarks';
import { useRemoveBookmark } from '@/hooks/api/useToggleBookmark';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BOOKMARK_TABS, filterBookmarksByTab } from '@/lib/bookmark-filters';
import { isBookmarkTappable, navigateToBookmark } from '@/lib/bookmark-navigation';
import { bookmarkCreateTypeFromItem, type BookmarkDTO, type BookmarkTab } from '@/types/bookmarks';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { Text } from '@/components/ui/text';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth0 } from 'react-native-auth0';
import { useGuest } from '@/providers/guest';
import { Swipeable } from 'react-native-gesture-handler';

function tabLabel(tab: BookmarkTab, t: (k: string) => string): string {
  switch (tab) {
    case 'all':
      return t('search_all');
    case 'plans':
      return t('home_shortcut_plans');
    case 'mala':
      return t('home_mala');
    case 'timers':
      return t('bookmark_timers');
    case 'texts':
      return t('bookmark_texts');
  }
}

function emptyCopy(tab: BookmarkTab, t: (k: string) => string): { title: string; hint: string } {
  switch (tab) {
    case 'plans':
      return { title: t('bookmarks_empty_plans_title'), hint: t('bookmarks_empty_plans_subtitle') };
    case 'mala':
      return { title: t('bookmarks_empty_malas_title'), hint: t('bookmarks_empty_malas_subtitle') };
    case 'timers':
      return { title: t('bookmarks_empty_timers_title'), hint: t('bookmarks_empty_timers_subtitle') };
    case 'texts':
      return { title: t('bookmarks_empty_texts_title'), hint: t('bookmarks_empty_texts_subtitle') };
    default:
      return { title: t('bookmarks_empty_all_title'), hint: t('bookmarks_empty_all_subtitle') };
  }
}

export default function BookmarksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslate();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const [tab, setTab] = useState<BookmarkTab>('all');
  const { data = [], isLoading, isRefetching, refetch, isError } = useBookmarks();
  const remove = useRemoveBookmark();

  const { scaffoldBackground } = useThemeColors();
  const filtered = useMemo(() => filterBookmarksByTab(data, tab), [data, tab]);
  const empty = emptyCopy(tab, t);

  if (isGuest || !user) {
    return (
      <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: scaffoldBackground }}>
        <Header onBack={() => router.back()} title={t('bookmarks')} />
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-center text-muted-foreground">{t('bookmarks_login_required', "Sign in to view your bookmarks.")}</Text>
          <Pressable onPress={showLoginDrawer} className="mt-4 active:opacity-70">
            <Text className="font-semibold text-foreground">{t('sign_in')}</Text>
          </Pressable>
        </View>
        <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
      </View>
    );
  }

  const confirmRemove = (bookmark: BookmarkDTO) => {
    Alert.alert(t('removeItem'), t('bookmarks_remove_confirm_body', "This will remove the bookmark from your list."), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => {
          remove.mutate({
            bookmarkId: bookmark.id,
            sourceId: bookmark.sourceId,
            type: bookmarkCreateTypeFromItem(bookmark.type) ?? undefined,
          });
        },
      },
    ]);
  };

  return (
    <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: scaffoldBackground }}>
      <Header onBack={() => router.back()} title={t('bookmarks')} />

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            gap: 24,
            paddingHorizontal: 16,
            paddingBottom: 8,
          }}
        >
          {BOOKMARK_TABS.map((key) => (
            <Pressable key={key} onPress={() => setTab(key)}>
              <Text
                className={`pb-2 text-base ${
                  tab === key
                    ? 'border-b-2 border-foreground font-bold text-foreground'
                    : 'font-medium text-muted-foreground'
                }`}
              >
                {tabLabel(key, t)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="flex-1">
          <BookmarkListSkeleton />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="mb-3 text-muted-foreground">{t('unableToLoad')}</Text>
          <Pressable onPress={() => void refetch()} className="active:opacity-70">
            <Text className="font-semibold">{t('retry')}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          className="flex-1"
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            filtered.length === 0
              ? { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16 }
              : { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }
          }
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
          ListEmptyComponent={
            <View className="items-center justify-center px-4">
              <Text className="text-center text-base font-semibold text-foreground">
                {empty.title}
              </Text>
              <Text className="mt-2 text-center text-sm text-muted-foreground">
                {empty.hint}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <Pressable
                  onPress={() => confirmRemove(item)}
                  className="mb-3 justify-center rounded-xl bg-[#c0392b] px-5 active:opacity-70"
                >
                  <Text className="font-semibold text-white">{t('delete')}</Text>
                </Pressable>
              )}
            >
              <Pressable
                onLongPress={() => confirmRemove(item)}
                delayLongPress={400}
              >
                <BookmarkCard
                  bookmark={item}
                  onPress={
                    isBookmarkTappable(item)
                      ? () => navigateToBookmark(router, item)
                      : undefined
                  }
                  onRemove={() => confirmRemove(item)}
                />
              </Pressable>
            </Swipeable>
          )}
        />
      )}
      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </View>
  );
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <View className="mb-1 flex-row items-center px-2 py-2">
      <Pressable onPress={onBack} className="p-2 active:opacity-70">
        <Ionicons name="chevron-back" size={24} color="#000" />
      </Pressable>
      <Text className="mr-10 flex-1 text-center text-[17px] font-semibold text-foreground">
        {title}
      </Text>
    </View>
  );
}
