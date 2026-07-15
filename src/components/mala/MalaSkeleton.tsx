import { MalaBeadArcPlaceholder, SkeletonBone } from '@/components/mala/MalaBeadArcPlaceholder';
import { useThemeColors } from '@/hooks/useThemeColors';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { View } from 'react-native';

function SwitcherSkeleton({ skeletonColor, chevronColor }: { skeletonColor: string; chevronColor: string }) {
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <CaretLeft size={32} color={chevronColor} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <SkeletonBone width={200} height={32} color={skeletonColor} />
        <View style={{ height: 16 }} />
        <SkeletonBone width={140} height={20} color={skeletonColor} />
      </View>
      <CaretRight size={32} color={chevronColor} />
    </View>
  );
}

function CounterAndBeadsSkeleton({ skeletonColor }: { skeletonColor: string }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignSelf: 'flex-start' }}>
        <SkeletonBone width={120} height={40} color={skeletonColor} />
        <View style={{ height: 8 }} />
        <SkeletonBone width={90} height={24} color={skeletonColor} />
      </View>
      <View style={{ height: 16 }} />
      <MalaBeadArcPlaceholder flex />
      <View style={{ height: 24 }} />
    </View>
  );
}

/** Layout skeleton while mantra catalogue loads — mirrors Flutter MalaSkeleton. */
export function MalaSkeleton() {
  const { skeleton, foreground } = useThemeColors();
  const chevronColor = `${foreground}40`;

  return (
    <View style={{ flex: 1, paddingHorizontal: 24 }}>
      <View style={{ flex: 0.4, minHeight: 40 }}>
        <SwitcherSkeleton skeletonColor={skeleton} chevronColor={chevronColor} />
      </View>
      <View style={{ flex: 0.6 }}>
        <CounterAndBeadsSkeleton skeletonColor={skeleton} />
      </View>
    </View>
  );
}
