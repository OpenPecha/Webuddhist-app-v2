import { Text } from '@/components/ui/text';
import { EnrolledPlanStatusIndicator } from '@/components/plans/EnrolledPlanStatusIndicator';
import type { PlanDateRange } from '@/utils/plan-utils';
import { View } from 'react-native';
import { useTranslate } from '@tolgee/react';

interface PlanDayHeaderProps {
  selectedDay: number;
  totalDays: number;
  planId: string;
  dateRange: PlanDateRange;
  planStartDate: Date;
  completionMap?: Record<number, boolean>;
  onMissedDaysPress?: (day: number) => void;
}

export function PlanDayHeader({
  selectedDay,
  totalDays,
  planId,
  dateRange,
  planStartDate,
  completionMap,
  onMissedDaysPress,
}: PlanDayHeaderProps) {
  const { t } = useTranslate();

  return (
    <View className="flex-row items-center justify-between px-4 mb-1">
      <Text className="text-lg font-bold text-foreground">
        {t('plan_day_of', { day: selectedDay, total: totalDays })}
      </Text>
      <EnrolledPlanStatusIndicator
        planId={planId}
        dateRange={dateRange}
        totalDays={totalDays}
        planStartDate={planStartDate}
        completionMap={completionMap}
        onMissedDaysPress={onMissedDaysPress}
      />
    </View>
  );
}
