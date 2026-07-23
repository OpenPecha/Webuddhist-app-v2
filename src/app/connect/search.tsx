import { ConnectSearchBar } from '@/components/connect/ConnectSearchBar';
import { GroupListCard } from '@/components/connect/GroupListCard';
import { SearchEmptyState } from '@/components/connect/SearchEmptyState';
import { CONNECT_PADDING } from '@/components/connect/connect-styles';
import { useDiscoverGroups, useJoinedGroups } from '@/hooks/api/useDiscoverGroups';
import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/utils/cn';
import { usePendingGroups } from '@/hooks/usePendingGroups';
import { filterDiscoverGroups, mergeMyGroupsWithPending } from '@/lib/connect-groups';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GroupSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeColors();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const pending = usePendingGroups();

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isRefetching, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDiscoverGroups(debounced);
  const { data: joinedData } = useJoinedGroups();

  const joinedIds = useMemo(() => {
    const merged = mergeMyGroupsWithPending(
      joinedData?.groups ?? [],
      pending.pendingJoinedGroups,
      pending.pendingUnjoinedIds,
    );
    return new Set(merged.map((g) => g.id));
  }, [joinedData?.groups, pending.pendingJoinedGroups, pending.pendingUnjoinedIds]);

  const groups = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.groups) ?? [];
    return filterDiscoverGroups(all, joinedIds);
  }, [data, joinedIds]);

  const trimmedQuery = query.trim();
  const showHint = trimmedQuery.length === 0;

  return (
    <View className={cn('flex-1', isDark ? 'bg-black' : 'bg-[#FBF9F4]')} style={{ paddingTop: insets.top }}>
      <ConnectSearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={"Search groups"}
        onBack={() => router.back()}
      />

      {showHint ? (
        <SearchEmptyState variant="hint" message={"Search for groups"} />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: CONNECT_PADDING, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator style={{ marginTop: 48 }} />
            ) : (
              <SearchEmptyState variant="no_results" message={"No matching groups found"} />
            )
          }
          renderItem={({ item }) => <GroupListCard group={item} />}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
          }
        />
      )}
    </View>
  );
}
