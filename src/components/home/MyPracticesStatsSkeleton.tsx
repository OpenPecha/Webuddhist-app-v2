import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function MyPracticesStatsSkeleton() {
  const { skeleton, skeletonMid } = useThemeColors();

  return (
    <View style={{ marginHorizontal: 16 }}>
      <View
        style={{
          borderRadius: 20,
          backgroundColor: skeleton,
          padding: 20,
          gap: 16,
        }}
      >
        <View style={{ height: 20, width: '60%', borderRadius: 4, backgroundColor: skeletonMid }} />
        <View style={{ height: 14, width: '40%', borderRadius: 4, backgroundColor: skeletonMid }} />
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1, height: 40, borderRadius: 4, backgroundColor: skeletonMid }} />
          <View style={{ flex: 1, height: 40, borderRadius: 4, backgroundColor: skeletonMid }} />
        </View>
      </View>
    </View>
  );
}
