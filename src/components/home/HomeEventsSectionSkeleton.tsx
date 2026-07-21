import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function HomeEventsSectionSkeleton() {
  const { skeleton, skeletonMid } = useThemeColors();

  return (
    <View className="gap-3 px-4">
      <View className="flex-row justify-between">
        <View className="h-5 w-20 rounded" style={{ backgroundColor: skeleton }} />
        <View className="h-4 w-14 rounded" style={{ backgroundColor: skeleton }} />
      </View>
      {[0, 1].map((key) => (
        <View
          key={key}
          className="flex-row overflow-hidden rounded-2xl"
          style={{ backgroundColor: skeletonMid }}
        >
          <View className="h-[88px] w-[88px]" style={{ backgroundColor: skeleton }} />
          <View className="flex-1 justify-center gap-2 p-3">
            <View className="h-3.5 w-[70%] rounded" style={{ backgroundColor: skeleton }} />
            <View className="h-3 w-[40%] rounded" style={{ backgroundColor: skeleton }} />
          </View>
        </View>
      ))}
    </View>
  );
}
