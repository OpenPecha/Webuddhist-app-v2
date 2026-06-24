import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function HomeEventsSectionSkeleton() {
  const { skeleton, skeletonMid } = useThemeColors();

  return (
    <View style={{ paddingHorizontal: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ height: 20, width: 80, borderRadius: 4, backgroundColor: skeleton }} />
        <View style={{ height: 16, width: 56, borderRadius: 4, backgroundColor: skeleton }} />
      </View>
      {[0, 1].map((key) => (
        <View
          key={key}
          style={{
            flexDirection: 'row',
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: skeletonMid,
          }}
        >
          <View style={{ width: 88, height: 88, backgroundColor: skeleton }} />
          <View style={{ flex: 1, padding: 12, gap: 8, justifyContent: 'center' }}>
            <View style={{ height: 14, width: '70%', borderRadius: 4, backgroundColor: skeleton }} />
            <View style={{ height: 12, width: '40%', borderRadius: 4, backgroundColor: skeleton }} />
          </View>
        </View>
      ))}
    </View>
  );
}
