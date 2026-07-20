import { AllPlansListSkeleton } from '@/components/practice/AllPlansListSkeleton';
import { PracticePlanListTile } from '@/components/practice/PracticePlanListTile';
import { useAllPlansSeries } from '@/hooks/api/useAllPlansSeries';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
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

export default function AllPlansScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { foreground, destructive, scaffoldBackground } = useThemeColors();

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
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 4,
          paddingBottom: 8,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ padding: 12 }}
          accessibilityRole="button"
          accessibilityLabel={t('common.back', { defaultValue: 'Back' })}
        >
          <Ionicons name="chevron-back" size={24} color={foreground} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: '700',
            fontFamily: 'Inter-Bold',
            textAlign: 'center',
            color: foreground,
          }}
          numberOfLines={1}
        >
          {t('home.home_shortcut_plans')}
        </Text>
        <Pressable
          onPress={() => router.push('/plans/search')}
          style={{ padding: 12 }}
          accessibilityRole="button"
          accessibilityLabel={t('plans.search_placeholder')}
        >
          <Ionicons name="search" size={22} color={foreground} />
        </Pressable>
      </View>

      {isLoading ? (
        <AllPlansListSkeleton />
      ) : isError ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            gap: 12,
          }}
        >
          <Text style={{ color: destructive, textAlign: 'center' }}>
            {t('plans.load_error')}
          </Text>
          <Pressable onPress={() => void refetch()} style={{ padding: 12 }}>
            <Text style={{ fontWeight: '600', fontFamily: 'Inter-SemiBold', color: foreground }}>
              {t('plans.retry')}
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={series}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: insets.bottom + 24,
            flexGrow: 1,
            gap: 12,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isFetchingNextPage}
              onRefresh={() => void refetch()}
            />
          }
          ListEmptyComponent={
            <View style={{ paddingTop: 48, paddingHorizontal: 24 }}>
              <Text style={{ color: '#8a8a8a', textAlign: 'center', fontSize: 15 }}>
                {t('home.no_series_found')}
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
            isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
          }
        />
      )}
    </View>
  );
}
