import { EnrolledPlanStatusIndicator } from '@/components/plans/EnrolledPlanStatusIndicator';
import { PlanDateRangeLabel } from '@/components/plans/PlanDateRangeLabel';
import {
  RoutineItemCard,
  routineItemCoverUri,
} from '@/components/practice/RoutineItemCard';
import type { RoutineBlock, RoutineItem } from '@/types/routine';
import type { UserPlan } from '@/types/plans';
import {
  createPlanDateRange,
  getEffectiveStartDate,
  resolveUserPlanForItem,
} from '@/utils/plan-utils';
import { Text, View } from 'react-native';

interface RoutineBlockSectionProps {
  block: RoutineBlock;
  userPlans: UserPlan[];
}

function RoutinePlanItem({
  item,
  userPlans,
}: {
  item: RoutineItem;
  userPlans: UserPlan[];
}) {
  const userPlan = resolveUserPlanForItem(item.id, userPlans);
  const dateRange = userPlan ? createPlanDateRange(userPlan) : null;
  const coverUri = routineItemCoverUri(item.coverImage, item.imageUrl);

  return (
    <RoutineItemCard
      title={item.title}
      coverUri={coverUri}
      type={item.type}
      subtitle={dateRange ? <PlanDateRangeLabel dateRange={dateRange} /> : undefined}
      trailing={
        dateRange && userPlan ? (
          <EnrolledPlanStatusIndicator
            planId={userPlan.id}
            dateRange={dateRange}
            totalDays={userPlan.total_days}
            planStartDate={getEffectiveStartDate(userPlan)}
          />
        ) : undefined
      }
    />
  );
}

export function RoutineBlockSection({ block, userPlans }: RoutineBlockSectionProps) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '500',
          fontFamily: 'Inter-SemiBold',
          color: '#000',
          marginBottom: 8,
        }}
      >
        {block.formattedTime}
      </Text>

      {block.items.map((item, index) => (
        <View key={`${item.type}-${item.id}-${index}`}>
          {item.type === 'plan' ? (
            <RoutinePlanItem item={item} userPlans={userPlans} />
          ) : (
            <RoutineItemCard
              title={item.title}
              type="recitation"
            />
          )}
          {index < block.items.length - 1 ? (
            <View style={{ height: 1, backgroundColor: '#e8e8e4', marginLeft: 90 }} />
          ) : null}
        </View>
      ))}

      {block.items.length > 0 ? (
        <View style={{ height: 1, backgroundColor: '#e8e8e4', marginTop: 8 }} />
      ) : null}
    </View>
  );
}
