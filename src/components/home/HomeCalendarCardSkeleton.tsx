import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function HomeCalendarCardSkeleton() {
  const { skeleton, skeletonMid, cardBorder, cardSurface } = useThemeColors();

  return (
    <View style={{ marginHorizontal: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: cardBorder,
          backgroundColor: cardSurface,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: skeletonMid,
          }}
        />
        <View style={{ width: 16 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={{ height: 16, width: '55%', borderRadius: 4, backgroundColor: skeleton }} />
          <View style={{ height: 14, width: '40%', borderRadius: 4, backgroundColor: skeletonMid }} />
        </View>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            backgroundColor: skeletonMid,
          }}
        />
      </View>
    </View>
  );
}
