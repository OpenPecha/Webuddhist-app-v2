import '@/lib/i18n';
import { GroupListCard } from '@/components/connect/GroupListCard';
import { CONNECT_PADDING } from '@/components/connect/connect-styles';
import { useJoinedGroups } from '@/hooks/api/useDiscoverGroups';
import { useThemeColors } from '@/hooks/useThemeColors';
import { usePendingGroups } from '@/hooks/usePendingGroups';
import { mergeMyGroupsWithPending } from '@/lib/connect-groups';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyGroupsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { scaffoldBackground, foreground } = useThemeColors();
  const pending = usePendingGroups();
  const { data, isLoading, isRefetching, refetch } = useJoinedGroups();

  const groups = useMemo(
    () =>
      mergeMyGroupsWithPending(
        data?.groups ?? [],
        pending.pendingJoinedGroups,
        pending.pendingUnjoinedIds,
      ),
    [data?.groups, pending.pendingJoinedGroups, pending.pendingUnjoinedIds],
  );

  return (
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color={foreground} />
        </Pressable>
        <Text className="mr-10 flex-1 text-center text-[17px] font-semibold text-foreground">
          {t('connect.my_groups')}
        </Text>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: CONNECT_PADDING, paddingTop: 8 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={{ marginTop: 48 }} />
          ) : (
            <Text className="mt-12 text-center text-muted-foreground">
              {t('connect.my_groups_empty')}
            </Text>
          )
        }
        renderItem={({ item }) => <GroupListCard group={item} showChevron />}
      />
    </View>
  );
}
