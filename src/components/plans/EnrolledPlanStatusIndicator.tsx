import { usePlanCompletionStatus } from '@/hooks/api/usePlanCompletionStatus';
import {
  calculateMissedDays,
  createPlanDateRange,
  dateOnly,
  getEffectiveStartDate,
} from '@/utils/plan-utils';
import type { PlanDateRange } from '@/utils/plan-utils';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

function OnTrackBadge() {
  const { t } = useTranslation();
  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(138, 138, 138, 0.5)',
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
    >
      <Text style={{ fontSize: 12, color: '#8a8a8a', fontFamily: 'Inter-Regular' }}>
        {t('practice.plan_status_on_track')}
      </Text>
    </View>
  );
}

function MissedDaysBadge({ count }: { count: number }) {
  const { t } = useTranslation();
  const label =
    count === 1
      ? t('practice.missed_days_one')
      : t('practice.missed_days_other', { count });

  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(138, 138, 138, 0.5)',
        paddingHorizontal: 12,
        paddingVertical: 4,
      }}
    >
      <Text style={{ fontSize: 9, color: '#8a8a8a', fontFamily: 'Inter-Regular' }}>
        {label}
      </Text>
    </View>
  );
}

interface EnrolledPlanStatusIndicatorProps {
  planId: string;
  dateRange: PlanDateRange;
  totalDays: number;
  planStartDate: Date;
}

/** Matches Flutter EnrolledPlanStatusIndicator decision tree. */
export function EnrolledPlanStatusIndicator({
  planId,
  dateRange,
  totalDays,
  planStartDate,
}: EnrolledPlanStatusIndicatorProps) {
  const today = dateOnly(new Date());
  if (today < dateRange.start) return null;

  const { data: completion, isLoading, isError } = usePlanCompletionStatus(planId);
  if (isLoading || isError || !completion) return null;

  const allCompleted = Array.from({ length: totalDays }, (_, i) => i + 1).every(
    (day) => completion[day] === true,
  );
  if (allCompleted) return null;

  const missed = calculateMissedDays(planStartDate, totalDays, completion);
  if (dateRange.isCurrent && missed === 0) return <OnTrackBadge />;
  if (missed <= 0) return null;

  return <MissedDaysBadge count={missed} />;
}
