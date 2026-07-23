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

function tabLabel(tab: BookmarkTab): string {
  switch (tab) {
    case 'all':
      return "All";
    case 'plans':
      return "Plans";
    case 'mala':
      return "Mala";
    case 'timers':
      return "Timers";
    case 'texts':
      return "Texts";
  }
}

function emptyCopy(tab: BookmarkTab): { title: string; hint: string } {
  switch (tab) {
    case 'plans':
      return { title: "No bookmarked plans yet.", hint: "Bookmark a plan or series to find it here." };
    case 'mala':
      return { title: "No bookmarked mala yet.", hint: "Bookmark a mala preset from the mala screen." };
    case 'timers':
      return { title: "No bookmarked timers yet.", hint: "Bookmark a timer to start it quickly from here." };
    case 'texts':
      return { title: "No bookmarked texts yet.", hint: "Bookmark a text or verse while reading." };
    default:
      return { title: "Nothing bookmarked yet.", hint: "Bookmark anything to save it here." };
  }
}

export default function BookmarksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const [tab, setTab] = useState<BookmarkTab>('all');
  const { data = [], isLoading, isRefetching, refetch, isError } = useBookmarks();
  const remove = useRemoveBookmark();

  const { scaffoldBackground } = useThemeColors();
  const filtered = useMemo(() => filterBookmarksByTab(data, tab), [data, tab]);
  const empty = emptyCopy(tab);

  if (isGuest || !user) {
    return (
      <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: scaffoldBackground }}>
        <Header onBack={() => router.back()} title={"Bookmarks"} />
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-center text-muted-foreground">{"Sign in to view your bookmarks."}</Text>
          <Pressable onPress={showLoginDrawer} className="mt-4 active:opacity-70">
            <Text className="font-semibold text-foreground">{"Sign in"}</Text>
          </Pressable>
        </View>
        <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
      </View>
    );
  }

  const confirmRemove = (bookmark: BookmarkDTO) => {
    Alert.alert("Remove bookmark?", "This will remove the bookmark from your list.", [
      { text: "Cancel", style: 'cancel' },
      {
        text: "Remove",
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
      <Header onBack={() => router.back()} title={"Bookmarks"} />

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
                {tabLabel(key)}
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
          <Text className="mb-3 text-muted-foreground">{"Could not load bookmarks. Please try again."}</Text>
          <Pressable onPress={() => void refetch()} className="active:opacity-70">
            <Text className="font-semibold">{"Retry"}</Text>
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
                  <Text className="font-semibold text-white">{"Remove"}</Text>
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
