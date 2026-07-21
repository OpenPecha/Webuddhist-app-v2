import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

export function PresetTimersGridSkeleton() {
  const { skeleton, cardSurface } = useThemeColors();

  return (
    <View className="flex-1 flex-row flex-wrap p-4 gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          className="w-[47%] aspect-square rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardSurface }}
        >
          <View className="flex-1 opacity-50" style={{ backgroundColor: skeleton }} />
        </View>
      ))}
    </View>
  );
}
