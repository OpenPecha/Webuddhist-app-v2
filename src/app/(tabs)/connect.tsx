import '@/lib/i18n';
import { ConnectHeader } from '@/components/connect/ConnectHeader';
import { DiscoverGroupCard } from '@/components/connect/DiscoverGroupCard';
import { MyGroupsSection } from '@/components/connect/MyGroupsSection';
import { MyGroupsSectionSkeleton } from '@/components/connect/MyGroupsSectionSkeleton';
import { useDiscoverGroups, useJoinedGroups } from '@/hooks/api/useDiscoverGroups';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConnectScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { scaffoldBackground, mutedForeground } = useThemeColors();
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscoverGroups('');
  const { isLoading: myGroupsLoading } = useJoinedGroups();

  const groups = data?.pages.flatMap((page) => page.groups) ?? [];

  const refreshAll = async () => {
    await Promise.all([
      refetch(),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups.all }),
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <ConnectHeader />
            {myGroupsLoading ? <MyGroupsSectionSkeleton /> : <MyGroupsSection />}
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                fontFamily: 'Inter-SemiBold',
                letterSpacing: 1,
                color: '#8a8a8a',
                textTransform: 'uppercase',
                paddingHorizontal: 20,
                marginBottom: 8,
              }}
            >
              {t('connect.discover')}
            </Text>
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={{ marginTop: 48 }} />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                color: mutedForeground,
                marginTop: 48,
                paddingHorizontal: 24,
              }}
            >
              {t('connect.empty')}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 20 }}>
            <DiscoverGroupCard group={item} />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refreshAll} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
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
