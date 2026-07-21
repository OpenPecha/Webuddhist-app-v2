import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function VerseOfDaySkeleton() {
  const { skeleton, skeletonMid } = useThemeColors();

  return (
    <View className="mx-4">
      <View
        className="overflow-hidden rounded-3xl"
        style={{ backgroundColor: skeletonMid }}
      >
        <View className="aspect-[1.65] w-full" style={{ backgroundColor: skeleton }} />
        <View className="gap-3 p-6">
          <View className="h-4 rounded" style={{ backgroundColor: skeleton }} />
          <View className="h-4 w-[80%] rounded" style={{ backgroundColor: skeleton }} />
          <View className="h-3 w-1/2 rounded" style={{ backgroundColor: skeleton }} />
        </View>
      </View>
    </View>
  );
}
