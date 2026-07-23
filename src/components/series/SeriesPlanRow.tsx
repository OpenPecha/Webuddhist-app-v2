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
import { cn } from '@/utils/cn';
import { imageUrl } from '@/utils/image-url';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

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
      className={cn(
        'flex-row items-center pb-3',
        locked ? 'opacity-45' : 'active:opacity-75',
      )}
    >
      <View className="w-[86px] h-[86px] rounded-xl overflow-hidden bg-[#e8e8e4]">
        {plan.image ? (
          <Image
            source={{ uri: imageUrl(plan.image, 'thumbnail') }}
            style={{ width: 86, height: 86 }}
            contentFit="cover"
          />
        ) : (
          <View className="flex-1 bg-[#DEAD2D22] items-center justify-center">
            <Ionicons name="image-outline" size={24} color="rgba(255,255,255,0.5)" />
          </View>
        )}
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold leading-[22px] text-foreground" numberOfLines={2}>
          {plan.title}
        </Text>
        <View className="flex-row items-center mt-1.5">
          <View className="flex-1">
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

  const parts = [
    `${planCount} PLANS`,
    `${totalDays} DAYS`,
    enrolledCount != null ? `${enrolledCount} ENROLLED` : null,
  ].filter(Boolean);

  return (
    <Text className="text-[13px] font-medium text-muted-foreground">{parts.join(' • ')}</Text>
  );
}
