import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

function SkeletonBlock({
  width,
  height,
  borderRadius = 8,
  color,
}: {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  color: string;
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: color,
      }}
    />
  );
}

export function AllPlansListSkeleton({ rows = 6 }: { rows?: number }) {
  const { cardSurface, skeleton } = useThemeColors();

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
      {Array.from({ length: rows }).map((_, index) => (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            borderRadius: 16,
            backgroundColor: cardSurface,
            padding: 12,
          }}
        >
          <SkeletonBlock width={56} height={56} borderRadius={12} color={skeleton} />
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonBlock width="75%" height={14} color={skeleton} />
            <SkeletonBlock width="55%" height={12} color={skeleton} />
            <SkeletonBlock width="40%" height={6} borderRadius={4} color={skeleton} />
          </View>
        </View>
      ))}
    </View>
  );
}
