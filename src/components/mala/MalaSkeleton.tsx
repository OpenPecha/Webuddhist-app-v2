import { MalaBeadArcPlaceholder, SkeletonBone } from '@/components/mala/MalaBeadArcPlaceholder';
import { useThemeColors } from '@/hooks/useThemeColors';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { View } from 'react-native';

function SwitcherSkeleton({ skeletonColor, chevronColor }: { skeletonColor: string; chevronColor: string }) {
  return (
    <View className="flex-1 flex-row items-center">
      <CaretLeft size={32} color={chevronColor} />
      <View className="flex-1 items-center justify-center">
        <SkeletonBone width={200} height={32} color={skeletonColor} />
        <View className="h-4" />
        <SkeletonBone width={140} height={20} color={skeletonColor} />
      </View>
      <CaretRight size={32} color={chevronColor} />
    </View>
  );
}

function CounterAndBeadsSkeleton({ skeletonColor }: { skeletonColor: string }) {
  return (
    <View className="flex-1">
      <View className="self-start">
        <SkeletonBone width={120} height={40} color={skeletonColor} />
        <View className="h-2" />
        <SkeletonBone width={90} height={24} color={skeletonColor} />
      </View>
      <View className="h-4" />
      <MalaBeadArcPlaceholder flex />
      <View className="h-6" />
    </View>
  );
}

/** Layout skeleton while mantra catalogue loads — mirrors Flutter MalaSkeleton. */
export function MalaSkeleton() {
  const { skeleton, foreground } = useThemeColors();
  const chevronColor = `${foreground}40`;

  return (
    <View className="flex-1 px-6">
      <View className="flex-[0.4] min-h-10">
        <SwitcherSkeleton skeletonColor={skeleton} chevronColor={chevronColor} />
      </View>
      <View className="flex-[0.6]">
        <CounterAndBeadsSkeleton skeletonColor={skeleton} />
      </View>
    </View>
  );
}
