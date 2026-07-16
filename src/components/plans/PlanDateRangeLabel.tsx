import { Text } from '@/components/ui/text';
import type { PlanDateRange } from '@/utils/plan-utils';
import { View } from 'react-native';

export function PlanDateRangeLabel({ dateRange }: { dateRange: PlanDateRange }) {
  if (dateRange.isCurrent) {
    return (
      <View
        style={{
          alignSelf: 'flex-start',
          backgroundColor: '#000',
          borderRadius: 20,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
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
