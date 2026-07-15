import type { PlanDateRange } from '@/utils/plan-utils';
import { Text, View } from 'react-native';

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
        <Text
          style={{
            color: '#fff',
            fontSize: 12,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
          }}
        >
          {dateRange.formatted}
        </Text>
      </View>
    );
  }

  return (
    <Text
      style={{ fontSize: 13, color: '#8a8a8a', fontFamily: 'Inter-Regular' }}
      numberOfLines={1}
    >
      {dateRange.formatted}
    </Text>
  );
}
