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
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyGroupsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { scaffoldBackground, foreground, mutedForeground } = useThemeColors();
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
        <Text
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: foreground,
            textAlign: 'center',
            marginRight: 40,
          }}
        >
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
            <Text style={{ textAlign: 'center', color: mutedForeground, marginTop: 48 }}>
              {t('connect.my_groups_empty')}
            </Text>
          )
        }
        renderItem={({ item }) => <GroupListCard group={item} showChevron />}
      />
    </View>
  );
}
