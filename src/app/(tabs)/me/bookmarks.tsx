import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { BookmarkCard } from '@/components/bookmarks/BookmarkCard';
import { BookmarkListSkeleton } from '@/components/bookmarks/BookmarkListSkeleton';
import { useBookmarks } from '@/hooks/api/useBookmarks';
import { useRemoveBookmark } from '@/hooks/api/useToggleBookmark';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { BOOKMARK_TABS, filterBookmarksByTab } from '@/lib/bookmark-filters';
import { isBookmarkTappable, navigateToBookmark } from '@/lib/bookmark-navigation';
import { bookmarkCreateTypeFromItem, type BookmarkDTO, type BookmarkTab } from '@/types/bookmarks';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth0 } from 'react-native-auth0';
import { useGuest } from '@/providers/guest';
import { Swipeable } from 'react-native-gesture-handler';

function tabLabel(tab: BookmarkTab, t: (k: string) => string): string {
  switch (tab) {
    case 'all':
      return t('bookmarks.tab_all');
    case 'plans':
      return t('bookmarks.tab_plans');
    case 'mala':
      return t('bookmarks.tab_mala');
    case 'timers':
      return t('bookmarks.tab_timers');
    case 'texts':
      return t('bookmarks.tab_texts');
  }
}

function emptyCopy(tab: BookmarkTab, t: (k: string) => string): { title: string; hint: string } {
  switch (tab) {
    case 'plans':
      return { title: t('bookmarks.empty_plans'), hint: t('bookmarks.empty_plans_hint') };
    case 'mala':
      return { title: t('bookmarks.empty_mala'), hint: t('bookmarks.empty_mala_hint') };
    case 'timers':
      return { title: t('bookmarks.empty_timers'), hint: t('bookmarks.empty_timers_hint') };
    case 'texts':
      return { title: t('bookmarks.empty_texts'), hint: t('bookmarks.empty_texts_hint') };
    default:
      return { title: t('bookmarks.empty_all'), hint: t('bookmarks.empty_all_hint') };
  }
}

export default function BookmarksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const [tab, setTab] = useState<BookmarkTab>('all');
  const { data = [], isLoading, isRefetching, refetch, isError } = useBookmarks();
  const remove = useRemoveBookmark();

  const filtered = useMemo(() => filterBookmarksByTab(data, tab), [data, tab]);
  const empty = emptyCopy(tab, t);

  if (isGuest || !user) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9F8F4', paddingTop: insets.top }}>
        <Header onBack={() => router.back()} title={t('bookmarks.title')} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ textAlign: 'center', color: '#666' }}>{t('bookmarks.login_required')}</Text>
          <Pressable onPress={showLoginDrawer} style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: '600', color: '#000' }}>{t('settings.sign_in')}</Text>
          </Pressable>
        </View>
        <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
      </View>
    );
  }

  const confirmRemove = (bookmark: BookmarkDTO) => {
    Alert.alert(t('bookmarks.remove_confirm_title'), t('bookmarks.remove_confirm_body'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('bookmarks.remove'),
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
    <View style={{ flex: 1, backgroundColor: '#F9F8F4', paddingTop: insets.top }}>
      <Header onBack={() => router.back()} title={t('bookmarks.title')} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 20, paddingBottom: 8 }}
      >
        {BOOKMARK_TABS.map((key) => (
          <Pressable key={key} onPress={() => setTab(key)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: tab === key ? '700' : '500',
                color: tab === key ? '#000' : '#8a8a8a',
                borderBottomWidth: tab === key ? 2 : 0,
                borderBottomColor: '#000',
                paddingBottom: 8,
              }}
            >
              {tabLabel(key, t)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {isLoading ? (
        <BookmarkListSkeleton />
      ) : isError ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: '#666', marginBottom: 12 }}>{t('bookmarks.load_error')}</Text>
          <Pressable onPress={() => void refetch()}>
            <Text style={{ fontWeight: '600' }}>{t('practice.retry')}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 48 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', textAlign: 'center' }}>
                {empty.title}
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' }}>
                {empty.hint}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <Pressable
                  onPress={() => confirmRemove(item)}
                  style={{
                    backgroundColor: '#c0392b',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    marginBottom: 12,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>{t('bookmarks.remove')}</Text>
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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 4,
      }}
    >
      <Pressable onPress={onBack} style={{ padding: 8 }}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </Pressable>
      <Text
        style={{
          flex: 1,
          fontSize: 17,
          fontWeight: '600',
          textAlign: 'center',
          marginRight: 40,
          color: '#000',
        }}
      >
        {title}
      </Text>
    </View>
  );
}
