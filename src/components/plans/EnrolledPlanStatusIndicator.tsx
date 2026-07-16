import { Text } from '@/components/ui/text';
import { usePlanCompletionStatus } from '@/hooks/api/usePlanCompletionStatus';
import {
  calculateMissedDays,
  dateOnly,
  firstMissedDay,
} from '@/utils/plan-utils';
import type { PlanDateRange } from '@/utils/plan-utils';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

function OnTrackBadge() {
  const { t } = useTranslation();
  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(138, 138, 138, 0.5)',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
    >
      <Text className="text-xs text-muted-foreground uppercase">{t('practice.plan_status_on_track')}</Text>
    </View>
  );
}

function MissedDaysBadge({
  count,
  onPress,
}: {
  count: number;
  onPress?: () => void;
}) {
  const { t } = useTranslation();
  const label =
    count === 1
      ? t('practice.missed_days_one')
      : t('practice.missed_days_other', { count });

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(138, 138, 138, 0.5)',
        backgroundColor: '#fff',
        paddingHorizontal: onPress ? 10 : 12,
        paddingVertical: 4,
      }}
    >
      {onPress ? (
        <Ionicons name="arrow-back" size={10} color="#8a8a8a" style={{ marginRight: 4 }} />
      ) : null}
      <Text className="text-[10px] text-muted-foreground">{label}</Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

interface EnrolledPlanStatusIndicatorProps {
  planId: string;
  dateRange: PlanDateRange;
  totalDays: number;
  planStartDate: Date;
  completionMap?: Record<number, boolean>;
  onMissedDaysPress?: (firstMissedDay: number) => void;
}

/** Matches Flutter EnrolledPlanStatusIndicator decision tree. */
export function EnrolledPlanStatusIndicator({
  planId,
  dateRange,
  totalDays,
  planStartDate,
  completionMap: completionMapProp,
  onMissedDaysPress,
}: EnrolledPlanStatusIndicatorProps) {
  const today = dateOnly(new Date());
  if (today < dateRange.start) return null;

  const { data: fetchedCompletion, isLoading, isError } = usePlanCompletionStatus(
    planId,
    completionMapProp == null,
  );
  const completion = completionMapProp ?? fetchedCompletion;

  if (completionMapProp == null && (isLoading || isError || !completion)) return null;
  if (!completion) return null;

  const allCompleted = Array.from({ length: totalDays }, (_, i) => i + 1).every(
    (day) => completion[day] === true,
  );
  if (allCompleted) return null;

  const missed = calculateMissedDays(planStartDate, totalDays, completion);
  if (dateRange.isCurrent && missed === 0) return <OnTrackBadge />;
  if (missed <= 0) return null;

  const firstMissed = firstMissedDay(planStartDate, totalDays, completion);
  return (
    <MissedDaysBadge
      count={missed}
      onPress={
        firstMissed != null && onMissedDaysPress
          ? () => onMissedDaysPress(firstMissed)
          : undefined
      }
    />
  );
}
