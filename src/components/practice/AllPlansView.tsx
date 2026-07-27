import { AllPlansListSkeleton } from '@/components/practice/AllPlansListSkeleton';
import { PracticePlanListTile } from '@/components/practice/PracticePlanListTile';
import { useAllPlansSeries } from '@/hooks/api/useAllPlansSeries';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AllPlansViewProps {
  onSearchPress: () => void;
}

export function AllPlansView({ onSearchPress }: AllPlansViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslate();
  const { foreground } = useThemeColors();

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAllPlansSeries();

  const series = useMemo(
    () => data?.pages.flatMap((page) => page.series) ?? [],
    [data],
  );

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-1 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="p-3 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('back')}
        >
          <Ionicons name="chevron-back" size={24} color={foreground} />
        </Pressable>
        <Text
          className="flex-1 text-center text-[17px] font-bold text-foreground"
          numberOfLines={1}
        >
          {t('home_shortcut_plans')}
        </Text>
        <Pressable
          onPress={onSearchPress}
          className="p-3 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('search_plans')}
        >
          <Ionicons name="search" size={22} color={foreground} />
        </Pressable>
      </View>

      {isLoading ? (
        <AllPlansListSkeleton />
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 p-6">
          <Text className="text-center text-destructive">{t('session_plans_load_error')}</Text>
          <Pressable onPress={() => void refetch()} className="p-3 active:opacity-70">
            <Text className="font-semibold text-foreground">{t('retry')}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={series}
          keyExtractor={(item) => item.id}
          contentContainerClassName="grow gap-3 px-4 pt-2 pb-6"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isFetchingNextPage}
              onRefresh={() => void refetch()}
            />
          }
          ListEmptyComponent={
            <View className="px-6 pt-12">
              <Text className="text-center text-[15px] text-muted-foreground">
                {t('home_no_series_found')}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <PracticePlanListTile
              series={item}
              onPress={() => router.push(`/series/${item.id}`)}
            />
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator className="my-4" /> : null
          }
        />
      )}
    </View>
  );
}
