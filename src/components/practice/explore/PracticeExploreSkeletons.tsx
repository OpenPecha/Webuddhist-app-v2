import { View } from 'react-native';

function SkeletonBlock({ className, style }: { className: string; style?: object }) {
  return <View className={`bg-muted/40 ${className}`} style={style} />;
}

function SectionHeaderBones() {
  return (
    <View className="flex-row items-center justify-between px-4">
      <SkeletonBlock className="h-5 w-32 rounded" />
      <SkeletonBlock className="h-4 w-12 rounded" />
    </View>
  );
}

function HorizontalCards({
  count,
  width,
  height,
  radius,
}: {
  count: number;
  width: number;
  height: number;
  radius: number;
}) {
  return (
    <View className="flex-row gap-3 px-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBlock
          key={index}
          className=""
          style={{ width, height, borderRadius: radius }}
        />
      ))}
    </View>
  );
}

export function PracticePlansSectionSkeleton() {
  return (
    <View className="pt-5">
      <SectionHeaderBones />
      <View className="h-3" />
      <HorizontalCards count={2} width={300} height={240} radius={12} />
    </View>
  );
}

export function PracticeChantsSectionSkeleton() {
  return (
    <View className="pt-5">
      <SectionHeaderBones />
      <View className="h-3" />
      {Array.from({ length: 2 }).map((_, index) => (
        <View
          key={index}
          className="mx-4 mb-2 overflow-hidden rounded-xl bg-card px-4 py-2.5"
        >
          <View className="flex-row items-stretch">
            <SkeletonBlock className="w-1 self-stretch rounded-sm" />
            <View className="ml-3 flex-1 justify-center gap-2 py-1">
              <SkeletonBlock className="h-3.5 w-3/4 rounded" />
              <SkeletonBlock className="h-3 w-full rounded" />
            </View>
            <View className="ml-2 justify-center">
              <SkeletonBlock className="h-10 w-10 rounded-full" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export function PracticeAccumulationsSectionSkeleton() {
  return (
    <View className="pt-5">
      <SectionHeaderBones />
      <View className="h-3" />
      <View className="flex-row gap-4 px-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} className="items-center" style={{ width: 84 }}>
            <SkeletonBlock className="h-[70px] w-[70px] rounded-full" />
            <SkeletonBlock className="mt-2 h-3 w-16 rounded" />
          </View>
        ))}
      </View>
    </View>
  );
}

export function PracticeTimersSectionSkeleton() {
  return (
    <View className="pt-5">
      <SectionHeaderBones />
      <View className="h-3" />
      <HorizontalCards count={5} width={150} height={100} radius={16} />
    </View>
  );
}

export function PracticeAccumulationsGridSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <View className="flex-row flex-wrap px-4 pt-2">
      {Array.from({ length: rows * 2 }).map((_, index) => (
        <View key={index} className="w-1/2 items-center py-4">
          <SkeletonBlock className="h-16 w-16 rounded-full" />
          <SkeletonBlock className="mt-2 h-3.5 w-24 rounded" />
        </View>
      ))}
    </View>
  );
}
