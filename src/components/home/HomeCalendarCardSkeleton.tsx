import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function HomeCalendarCardSkeleton() {
  const { skeleton, skeletonMid, cardBorder, cardSurface } = useThemeColors();

  return (
    <View className="mx-4">
      <View
        className="flex-row items-center rounded-3xl border px-4 py-2"
        style={{ borderColor: cardBorder, backgroundColor: cardSurface }}
      >
        <View
          className="h-11 w-11 rounded-full"
          style={{ backgroundColor: skeletonMid }}
        />
        <View className="w-4" />
        <View className="flex-1 gap-1.5">
          <View className="h-4 w-[55%] rounded" style={{ backgroundColor: skeleton }} />
          <View className="h-3.5 w-[40%] rounded" style={{ backgroundColor: skeletonMid }} />
        </View>
        <View
          className="h-6 w-6 rounded"
          style={{ backgroundColor: skeletonMid }}
        />
      </View>
    </View>
  );
}
