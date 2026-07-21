import { cn } from '@/utils/cn';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  computeBeadPositions,
  MALA_BEADS_LAYOUT_HEIGHT,
  MALA_BEADS_LAYOUT_WIDTH,
} from '@/lib/mala-bead-geometry';
import { View, type ViewStyle } from 'react-native';

/** Shared skeleton block for mala loading states. */
export function SkeletonBone({
  width,
  height,
  circle = false,
  color,
  style,
}: {
  width: number;
  height: number;
  circle?: boolean;
  color: string;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: circle ? height / 2 : 8,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

function BeadArcSkeleton({ skeletonColor }: { skeletonColor: string }) {
  const beads = computeBeadPositions(MALA_BEADS_LAYOUT_WIDTH, MALA_BEADS_LAYOUT_HEIGHT, 0);

  return (
    <View
      className="relative h-[220px] w-[360px]"
    >
      {beads.map((bead) => {
        const size = bead.radius * 2;
        return (
          <SkeletonBone
            key={bead.slot}
            width={size}
            height={size}
            circle
            color={skeletonColor}
            style={{
              position: 'absolute',
              left: bead.x - bead.radius,
              top: bead.y - bead.radius,
            }}
          />
        );
      })}
    </View>
  );
}

interface MalaBeadArcPlaceholderProps {
  /** Fixed height; matches MalaBeads layout. Ignored when flex is true. */
  height?: number;
  width?: ViewStyle['width'];
  /** Fill remaining vertical space (catalogue skeleton). */
  flex?: boolean;
}

/** Bead-arc skeleton — used during catalogue load and accumulator seed. */
export function MalaBeadArcPlaceholder({
  height = MALA_BEADS_LAYOUT_HEIGHT,
  width = '100%',
  flex = false,
}: MalaBeadArcPlaceholderProps) {
  const { skeleton } = useThemeColors();

  return (
    <View
      className={cn('w-full items-center justify-center', flex && 'flex-1')}
      style={flex ? (width !== '100%' ? { width } : undefined) : { height, ...(width !== '100%' ? { width } : {}) }}
    >
      <BeadArcSkeleton skeletonColor={skeleton} />
    </View>
  );
}
