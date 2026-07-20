import { View } from 'react-native';

function SkeletonBlock({
  width,
  height,
  borderRadius = 8,
}: {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#e8e8e4',
      }}
    />
  );
}

export function PlanCatalogSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
      {Array.from({ length: rows }).map((_, index) => (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            gap: 12,
            borderRadius: 12,
            backgroundColor: '#fff',
            padding: 12,
          }}
        >
          <SkeletonBlock width={72} height={72} />
          <View style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
            <SkeletonBlock width="80%" height={14} />
            <SkeletonBlock width="50%" height={12} />
            <SkeletonBlock width="40%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}
