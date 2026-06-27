import { useThemeColors } from '@/hooks/useThemeColors';
import { useState } from 'react';
import { View, type LayoutChangeEvent, type ViewStyle } from 'react-native';

const BEAD_COUNT = 7;

/** Shared skeleton block for mala loading states. */
export function SkeletonBone({
  width,
  height,
  circle = false,
  color,
}: {
  width: number;
  height: number;
  circle?: boolean;
  color: string;
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: circle ? height / 2 : 8,
        backgroundColor: color,
      }}
    />
  );
}

function BeadArcSkeleton({ skeletonColor }: { skeletonColor: string }) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const diameter = layout.width > 0 ? Math.min(64, Math.max(24, layout.width * 0.15)) : 0;

  return (
    <View style={{ flex: 1, width: '100%' }} onLayout={onLayout}>
      {layout.width > 0 && layout.height > 0
        ? Array.from({ length: BEAD_COUNT }, (_, i) => {
            const t = i / (BEAD_COUNT - 1);
            const left = (layout.width - diameter) * t;
            const top = (layout.height - diameter) * (1 - t);
            return (
              <View key={i} style={{ position: 'absolute', left, top }}>
                <SkeletonBone width={diameter} height={diameter} circle color={skeletonColor} />
              </View>
            );
          })
        : null}
    </View>
  );
}

interface MalaBeadArcPlaceholderProps {
  /** Fixed height; matches MalaBeads LAYOUT_HEIGHT. Ignored when flex is true. */
  height?: number;
  width?: ViewStyle['width'];
  /** Fill remaining vertical space (catalogue skeleton). */
  flex?: boolean;
}

/** Bead-arc skeleton — used during catalogue load and accumulator seed. */
export function MalaBeadArcPlaceholder({
  height = 220,
  width = '100%',
  flex = false,
}: MalaBeadArcPlaceholderProps) {
  const { skeleton } = useThemeColors();

  return (
    <View
      style={{
        width,
        ...(flex ? { flex: 1 } : { height }),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BeadArcSkeleton skeletonColor={skeleton} />
    </View>
  );
}
