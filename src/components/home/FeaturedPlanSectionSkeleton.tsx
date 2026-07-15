import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function FeaturedPlanSectionSkeleton() {
  const { skeleton, cardSurface } = useThemeColors();

  return (
    <View style={{ paddingHorizontal: 16, gap: 12 }}>
      <View style={{ height: 20, width: 140, borderRadius: 4, backgroundColor: skeleton }} />
      <View
        style={{
          width: '100%',
          borderRadius: 16,
          backgroundColor: cardSurface,
          overflow: 'hidden',
        }}
      >
        <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: skeleton }} />
        <View style={{ padding: 12, gap: 8 }}>
          <View style={{ height: 16, width: '70%', borderRadius: 4, backgroundColor: skeleton }} />
        </View>
      </View>
    </View>
  );
}
