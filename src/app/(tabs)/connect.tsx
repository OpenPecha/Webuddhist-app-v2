import '@/lib/i18n';
import { ConnectHeader, ConnectSectionTitle } from '@/components/connect/ConnectHeader';
import { ConnectHeroImage } from '@/components/connect/ConnectHeroImage';
import { DiscoverEmptyState } from '@/components/connect/DiscoverEmptyState';
import { DiscoverGroupCard } from '@/components/connect/DiscoverGroupCard';
import { MyGroupsSection } from '@/components/connect/MyGroupsSection';
import { MyGroupsSectionSkeleton } from '@/components/connect/MyGroupsSectionSkeleton';
import { CONNECT_PADDING } from '@/components/connect/connect-styles';
import { useDiscoverGroups, useJoinedGroups } from '@/hooks/api/useDiscoverGroups';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  filterDiscoverGroups,
  mergeMyGroupsWithPending,
  syncPendingGroupsWithApi,
  syncPendingUnjoinWithApi,
} from '@/lib/connect-groups';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { usePendingGroups } from '@/hooks/usePendingGroups';
import {
  clearGroupPending,
} from '@/stores/pending-groups';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ConnectErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  const { destructive, foreground } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', gap: 12, paddingHorizontal: 24, marginTop: 48 }}>
      <Text
        style={{
          color: destructive,
          textAlign: 'center',
          fontFamily: 'Inter-Regular',
        }}
      >
        {t('connect.load_error')}
      </Text>
      <Pressable
        onPress={onRetry}
        style={{
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: foreground,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
          {t('practice.retry')}
        </Text>
      </Pressable>
    </View>
  );
}

export default function ConnectScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { scaffoldBackground, mutedForeground } = useThemeColors();
  const queryClient = useQueryClient();
  const pending = usePendingGroups();

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscoverGroups('');
  const { data: joinedData, isLoading: myGroupsLoading } = useJoinedGroups();

  const apiMyGroups = useMemo(() => joinedData?.groups ?? [], [joinedData?.groups]);
  const mergedMyGroups = useMemo(
    () =>
      mergeMyGroupsWithPending(
        apiMyGroups,
        pending.pendingJoinedGroups,
        pending.pendingUnjoinedIds,
      ),
    [apiMyGroups, pending.pendingJoinedGroups, pending.pendingUnjoinedIds],
  );

  useEffect(() => {
    const apiIds = new Set(apiMyGroups.map((g) => g.id));
    syncPendingGroupsWithApi(
      apiIds,
      clearGroupPending,
      pending.pendingJoinedIds,
      pending.pendingFollowedIds,
    );
    syncPendingUnjoinWithApi(apiIds, clearGroupPending, pending.pendingUnjoinedIds);
  }, [apiMyGroups, pending.pendingJoinedIds, pending.pendingFollowedIds, pending.pendingUnjoinedIds]);

  const joinedIds = useMemo(() => new Set(mergedMyGroups.map((g) => g.id)), [mergedMyGroups]);

  const groups = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.groups) ?? [];
    return filterDiscoverGroups(all, joinedIds);
  }, [data, joinedIds]);

  const hasMyGroups = mergedMyGroups.length > 0;
  const joinedTotal = joinedData?.total ?? mergedMyGroups.length;

  const refreshAll = async () => {
    await Promise.all([
      refetch(),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups.all }),
    ]);
  };

  const renderEmptyDiscover = () => {
    if (isError) return <ConnectErrorState onRetry={() => void refetch()} />;
    if (isLoading) return <ActivityIndicator style={{ marginTop: 48 }} />;
    if (hasMyGroups) return <DiscoverEmptyState />;
    return (
      <Text
        style={{
          textAlign: 'center',
          color: mutedForeground,
          marginTop: 48,
          paddingHorizontal: 24,
        }}
      >
        {t('connect.empty_title')}
      </Text>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <FlatList
        data={isError ? [] : groups}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <ConnectHeader />
            {myGroupsLoading ? (
              <MyGroupsSectionSkeleton />
            ) : hasMyGroups ? (
              <MyGroupsSection groups={mergedMyGroups} total={joinedTotal} />
            ) : (
              <ConnectHeroImage />
            )}
            <ConnectSectionTitle label={t('connect.discover_groups')} />
          </>
        }
        ListEmptyComponent={renderEmptyDiscover()}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: CONNECT_PADDING }}>
            <DiscoverGroupCard group={item} isJoined={joinedIds.has(item.id)} />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refreshAll} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && !isError) fetchNextPage();
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}
