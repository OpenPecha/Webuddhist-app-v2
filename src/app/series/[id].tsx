import '@/lib/i18n';
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
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth0 } from 'react-native-auth0';
import { useGuest } from '@/providers/guest';

export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: series, isLoading, error, refetch, isRefetching } = useSeriesById(id!);
  const { t } = useTranslation();
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
      { onError: () => Alert.alert(t('series.enroll_error')) },
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
        <Pressable onPress={() => router.back()} style={{ padding: 16 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <ActivityIndicator style={{ marginTop: 48 }} />
      </View>
    );
  }

  if (error || !series || !featuredPlan) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
        <Pressable onPress={() => router.back()} style={{ padding: 16 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Text style={{ color: '#dc341e' }}>{t('practice.routine_load_error')}</Text>
          <Pressable onPress={() => refetch()} style={{ padding: 12 }}>
            <Text>{t('practice.retry')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: '700',
            fontFamily: 'Inter-Bold',
            textAlign: 'center',
            marginRight: 40,
          }}
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
          <View style={{ marginTop: 16 }}>
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
