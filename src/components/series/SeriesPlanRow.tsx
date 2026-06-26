import { EnrolledPlanStatusIndicator } from '@/components/plans/EnrolledPlanStatusIndicator';
import { PlanDateRangeLabel } from '@/components/plans/PlanDateRangeLabel';
import type { Plan } from '@/types/series';
import type { UserPlan } from '@/types/plans';
import {
  createCatalogPlanDateRange,
  createPlanDateRange,
  getCurrentDay,
  getEffectiveStartDate,
  parseCalendarDate,
} from '@/utils/plan-utils';
import { imageUrl } from '@/utils/image-url';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

interface SeriesPlanRowProps {
  plan: Plan;
  isPlanEnrolled: (planId: string) => boolean;
  userPlan?: UserPlan;
  seriesId?: string;
}

export function SeriesPlanRow({
  plan,
  isPlanEnrolled,
  userPlan,
  seriesId,
}: SeriesPlanRowProps) {
  const router = useRouter();

  const dateRange = createCatalogPlanDateRange(plan.start_date, plan.total_days);
  const enrolled = isPlanEnrolled(plan.id);
  const planStart = parseCalendarDate(plan.start_date);
  const locked = planStart != null && planStart > new Date();

  const statusDateRange = userPlan ? createPlanDateRange(userPlan) : dateRange;
  const canShowStatus = enrolled && userPlan != null && statusDateRange != null;

  const navigateToTrack = (selectedDay?: number) => {
    const day =
      selectedDay ?? (userPlan ? getCurrentDay(userPlan) : undefined);
    router.push({
      pathname: '/practice/details',
      params: {
        planId: plan.id,
        title: plan.title,
        ...(day != null ? { selectedDay: String(day) } : {}),
      },
    });
  };

  const onPress = () => {
    if (locked) return;
    if (enrolled) {
      navigateToTrack();
    } else {
      router.push({
        pathname: '/plans/[id]',
        params: seriesId ? { id: plan.id, seriesId } : { id: plan.id },
      });
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,
        opacity: locked ? 0.45 : pressed ? 0.75 : 1,
      })}
    >
      <View
        style={{
          width: 86,
          height: 86,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#e8e8e4',
        }}
      >
        {plan.image ? (
          <Image
            source={{ uri: imageUrl(plan.image, 'thumbnail') }}
            style={{ width: 86, height: 86 }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: '#DEAD2D22',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="image-outline" size={24} color="rgba(255,255,255,0.5)" />
          </View>
        )}
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: '#000',
            lineHeight: 22,
          }}
          numberOfLines={2}
        >
          {plan.title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
          }}
        >
          <View style={{ flex: 1 }}>
            {dateRange ? <PlanDateRangeLabel dateRange={dateRange} /> : null}
          </View>
          {locked ? (
            <Ionicons name="lock-closed" size={20} color="#8a8a8a" style={{ marginLeft: 8 }} />
          ) : canShowStatus ? (
            <EnrolledPlanStatusIndicator
              planId={plan.id}
              dateRange={statusDateRange}
              totalDays={plan.total_days}
              planStartDate={getEffectiveStartDate(userPlan)}
              onMissedDaysPress={(day) => navigateToTrack(day)}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

interface SeriesStatsRowProps {
  planCount: number;
  totalDays: number;
  enrolledCount?: number;
}

export function SeriesStatsRow({ planCount, totalDays, enrolledCount }: SeriesStatsRowProps) {
  const { t } = useTranslation();

  const parts = [
    t('series.stats_plans', { count: planCount }),
    t('series.stats_days', { count: totalDays }),
    enrolledCount != null ? t('series.stats_enrolled', { count: enrolledCount }) : null,
  ].filter(Boolean);

  return (
    <Text style={{ fontSize: 13, fontWeight: '500', color: '#8a8a8a' }}>
      {parts.join(' • ')}
    </Text>
  );
}
