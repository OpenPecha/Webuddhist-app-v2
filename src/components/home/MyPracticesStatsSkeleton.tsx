import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function MyPracticesStatsSkeleton() {
  const { skeleton, skeletonMid } = useThemeColors();

  return (
    <View className="mx-4">
      <View
        className="gap-4 rounded-[20px] p-5"
        style={{ backgroundColor: skeleton }}
      >
        <View className="h-5 w-[60%] rounded" style={{ backgroundColor: skeletonMid }} />
        <View className="h-3.5 w-[40%] rounded" style={{ backgroundColor: skeletonMid }} />
        <View className="flex-row gap-4">
          <View className="h-10 flex-1 rounded" style={{ backgroundColor: skeletonMid }} />
          <View className="h-10 flex-1 rounded" style={{ backgroundColor: skeletonMid }} />
        </View>
      </View>
    </View>
  );
}
