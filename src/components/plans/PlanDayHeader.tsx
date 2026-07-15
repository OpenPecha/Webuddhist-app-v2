import { EnrolledPlanStatusIndicator } from '@/components/plans/EnrolledPlanStatusIndicator';
import type { PlanDateRange } from '@/utils/plan-utils';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 4,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          fontFamily: 'Inter-Bold',
          color: '#000',
        }}
      >
        {t('planTrack.day_of', { day: selectedDay, total: totalDays })}
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
