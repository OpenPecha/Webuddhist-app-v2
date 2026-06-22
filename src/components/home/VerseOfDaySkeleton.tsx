import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function VerseOfDaySkeleton() {
  const { skeleton, skeletonMid } = useThemeColors();

  return (
    <View style={{ marginHorizontal: 12 }}>
      <View
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: skeletonMid,
        }}
      >
        <View style={{ width: '100%', aspectRatio: 1.65, backgroundColor: skeleton }} />
        <View style={{ padding: 24, gap: 12 }}>
          <View style={{ height: 16, borderRadius: 4, backgroundColor: skeleton }} />
          <View style={{ height: 16, width: '80%', borderRadius: 4, backgroundColor: skeleton }} />
          <View style={{ height: 12, width: '50%', borderRadius: 4, backgroundColor: skeleton }} />
        </View>
      </View>
    </View>
  );
}
