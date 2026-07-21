import { Text } from '@/components/ui/text';
import type { PlanDateRange } from '@/utils/plan-utils';
import { View } from 'react-native';

export function PlanDateRangeLabel({ dateRange }: { dateRange: PlanDateRange }) {
  if (dateRange.isCurrent) {
    return (
      <View className="self-start rounded-[20px] bg-black px-2 py-1">
        <Text className="text-xs font-semibold text-white">{dateRange.formatted}</Text>
      </View>
    );
  }

  return (
    <Text className="text-[13px] text-muted-foreground" numberOfLines={1}>
      {dateRange.formatted}
    </Text>
  );
}
