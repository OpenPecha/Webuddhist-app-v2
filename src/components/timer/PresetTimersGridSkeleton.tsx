import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

const GRID_SPACING = 12;

export function PresetTimersGridSkeleton() {
  const { skeleton, cardSurface } = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: GRID_SPACING,
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          style={{
            width: '47%',
            aspectRatio: 1,
            borderRadius: 16,
            backgroundColor: cardSurface,
            overflow: 'hidden',
          }}
        >
          <View style={{ flex: 1, backgroundColor: skeleton, opacity: 0.5 }} />
        </View>
      ))}
    </View>
  );
}
