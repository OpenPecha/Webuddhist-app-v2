import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function FeaturedPlanSectionSkeleton() {
  const { skeleton, cardSurface } = useThemeColors();

  return (
    <View className="gap-3 px-4">
      <View className="h-5 w-[140px] rounded" style={{ backgroundColor: skeleton }} />
      <View
        className="w-full overflow-hidden rounded-2xl"
        style={{ backgroundColor: cardSurface }}
      >
        <View className="aspect-video w-full" style={{ backgroundColor: skeleton }} />
        <View className="gap-2 p-3">
          <View className="h-4 w-[70%] rounded" style={{ backgroundColor: skeleton }} />
        </View>
      </View>
    </View>
  );
}
