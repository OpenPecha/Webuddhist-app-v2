import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { FeaturedSeriesPlanCard } from '@/components/series/FeaturedSeriesPlanCard';
import { SeriesPlanRow } from '@/components/series/SeriesPlanRow';
import { useEnrollSeries } from '@/hooks/api/useEnrollSeries';
import { useIsSeriesEnrolled } from '@/hooks/api/useSeriesEnrollments';
import { useSeriesById } from '@/hooks/api/useSeries';
import { useUserPlans } from '@/hooks/api/useUserPlans';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { pickSeriesMetadata } from '@/types/series';
import { resolveUserPlanForItem } from '@/utils/plan-utils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Text } from '@/components/ui/text';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth0 } from 'react-native-auth0';
import { useGuest } from '@/providers/guest';

export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: series, isLoading, error, refetch, isRefetching } = useSeriesById(id!);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const enrollSeries = useEnrollSeries();
  const { isEnrolled, isLoading: isEnrollmentLoading } = useIsSeriesEnrolled(id!);
  const { data: userPlansData } = useUserPlans();

  const metadata = series ? pickSeriesMetadata(series.metadata, language) : undefined;
  const headerTitle = metadata?.title?.trim() || metadata?.sub_title?.trim() || '';

  const sorted = useMemo(
    () =>
      series
        ? [...series.plans].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        : [],
    [series],
  );

  const featuredPlan = sorted[0];

  const isPlanEnrolled = useCallback(
    (planId: string) => {
      const plans = userPlansData?.plans ?? [];
      return !!resolveUserPlanForItem(planId, plans);
    },
    [userPlansData],
  );

  const handleEnroll = () => {
    if (isGuest || !user) {
      showLoginDrawer();
      return;
    }
    enrollSeries.mutate(
      { series_id: id! },
      { onError: () => Alert.alert("Unable to enroll you. Check your connection and try again.") },
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#FDFDFC]" style={{ paddingTop: insets.top }}>
        <Pressable onPress={() => router.back()} className="p-4 active:opacity-70">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <ActivityIndicator style={{ marginTop: 48 }} />
      </View>
    );
  }

  if (error || !series || !featuredPlan) {
    return (
      <View className="flex-1 bg-[#FDFDFC]" style={{ paddingTop: insets.top }}>
        <Pressable onPress={() => router.back()} className="p-4 active:opacity-70">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-destructive">{"Couldn't load. Check your connection and try again."}</Text>
          <Pressable onPress={() => refetch()} className="p-3 active:opacity-70">
            <Text>{"Retry"}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FDFDFC]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-2 py-1">
        <Pressable onPress={() => router.back()} className="p-2 active:opacity-70">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text
          className="mr-10 flex-1 text-center text-xl font-bold text-foreground"
          numberOfLines={1}
        >
          {headerTitle}
        </Text>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <FeaturedSeriesPlanCard
          series={series}
          featuredPlan={featuredPlan}
          metadata={metadata}
          isEnrolled={isEnrolled}
          isEnrollmentLoading={isEnrollmentLoading}
          isEnrolling={enrollSeries.isPending}
          onEnroll={handleEnroll}
          seriesId={id!}
        />

        {sorted.length > 0 ? (
          <View className="mt-4">
            {sorted.map((plan) => {
              const userPlan = resolveUserPlanForItem(
                plan.id,
                userPlansData?.plans ?? [],
              );
              return (
                <SeriesPlanRow
                  key={plan.id}
                  plan={plan}
                  isPlanEnrolled={isPlanEnrolled}
                  userPlan={userPlan}
                  seriesId={id!}
                />
              );
            })}
          </View>
        ) : null}
      </ScrollView>

      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </View>
  );
}
