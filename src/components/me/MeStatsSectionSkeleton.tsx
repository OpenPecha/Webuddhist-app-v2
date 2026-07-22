import { useThemeColors } from '@/hooks/useThemeColors';
import { View } from 'react-native';

function Bone({ width, height, borderRadius = 4 }: { width: number | `${number}%`; height: number; borderRadius?: number }) {
  const { skeletonMid } = useThemeColors();
  return (
    <View style={{ width, height, borderRadius, backgroundColor: skeletonMid }} />
  );
}

function SkeletonCard({
  children,
  padding = 16,
}: {
  children: React.ReactNode;
  padding?: number;
}) {
  const { meCardSurface } = useThemeColors();

  return (
    <View
      className="rounded-2xl"
      style={{ padding, backgroundColor: meCardSurface }}
    >
      {children}
    </View>
  );
}

export function MeStatsSectionSkeleton() {
  const { meCardSurface } = useThemeColors();

  return (
    <View className="px-5 pb-6 pt-6">
      <Bone width="40%" height={20} />
      <View className="mt-3">
        <SkeletonCard>
          <View className="items-end">
            <Bone width={20} height={20} />
          </View>
          <View className="-mt-2 flex-row items-center justify-center">
            <Bone width={28} height={28} borderRadius={14} />
            <View className="w-2" />
            <Bone width={100} height={18} />
          </View>
          <View className="mt-2 items-center">
            <Bone width={120} height={14} />
          </View>
          <View className="mt-5 flex-row gap-1">
            {Array.from({ length: 7 }).map((_, index) => (
              <View key={index} className="flex-1 items-center gap-2">
                <Bone width={20} height={12} />
                <Bone width={36} height={36} borderRadius={8} />
              </View>
            ))}
          </View>
        </SkeletonCard>
      </View>
      <View className="mt-3">
        <SkeletonCard padding={20}>
          <View className="flex-row items-center">
            <Bone width={24} height={24} />
            <View className="w-3" />
            <Bone width="70%" height={16} />
          </View>
        </SkeletonCard>
      </View>
      <View className="mt-3 flex-row gap-3">
        {[0, 1].map((key) => (
          <View
            key={key}
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: meCardSurface }}
          >
            <Bone width="60%" height={12} />
            <View className="mt-3 flex-row items-center gap-1">
              <Bone width={22} height={22} />
              <Bone width="50%" height={18} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
