import {
  computeBeadPositions,
  MALA_BEADS_LAYOUT_HEIGHT,
  MALA_BEADS_LAYOUT_WIDTH,
  malaThreadPath,
} from '@/lib/mala-bead-geometry';
import { normalizeBeadImageUrl } from '@/lib/mala-bead-image';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Image, useImage, type ImageRef } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const SWIPE_DISTANCE = 24;
const SWIPE_VELOCITY = 200;
const ANIMATION_MS = 280;
/** Subtle anticlockwise tilt while a bead slides right → left (Flutter strand motion). */
const ROTATION_DEG = 0;
/** Bead texture is drawn small; cap decode size to match Flutter single-load pattern. */
const BEAD_TEXTURE_MAX = 128;

interface MalaBeadsProps {
  total: number;
  beadImageUrl?: string | null;
  enabled?: boolean;
  onIncrement: () => void;
  /** Fired once bead texture is ready (loaded, failed, or no URL). */
  onVisualReady?: () => void;
}

interface MalaBeadsShellProps {
  total: number;
  /** When false, gestures are ignored and the strand is dimmed. */
  enabled: boolean;
  onIncrement: () => void;
  beadImage: ImageRef | null;
}

/** Shell props without beadImage — texture layer supplies its own via useImage. */
type MalaBeadsShellInput = Omit<MalaBeadsShellProps, 'beadImage'>;

function BeadCircle({
  x,
  y,
  radius,
  beadImage,
  beadColor,
}: {
  x: number;
  y: number;
  radius: number;
  beadImage: ImageRef | null;
  beadColor: string;
}) {
  const size = radius * 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: x - radius,
        top: y - radius,
        width: size,
        height: size,
        borderRadius: radius,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: radius * 0.18 },
        shadowOpacity: 0.18,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {beadImage ? (
        <Image
          source={beadImage}
          style={{ width: size, height: size }}
          contentFit="cover"
        />
      ) : (
        <LinearGradient
          colors={[lighten(beadColor, 0.45), beadColor, darken(beadColor, 0.3)]}
          locations={[0, 0.55, 1]}
          start={{ x: 0.15, y: 0.1 }}
          end={{ x: 0.85, y: 0.9 }}
          style={{ width: size, height: size, borderRadius: radius }}
        />
      )}
    </View>
  );
}

function lighten(hex: string, amount: number): string {
  return blend(hex, '#ffffff', amount);
}

function darken(hex: string, amount: number): string {
  return blend(hex, '#000000', amount);
}

function blend(hex: string, target: string, amount: number): string {
  const parse = (c: string) => {
    const h = c.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(target);
  const mix = (a: number, b: number) => Math.round(a + (b - a) * amount);
  return `#${mix(r1, r2).toString(16).padStart(2, '0')}${mix(g1, g2).toString(16).padStart(2, '0')}${mix(b1, b2).toString(16).padStart(2, '0')}`;
}

function MalaBeadsShell({ total, enabled, onIncrement, beadImage }: MalaBeadsShellProps) {
  const { isDark } = useThemeColors();
  const threadColor = '#c62828';
  const beadColor = isDark ? '#8d6e63' : '#8d6e63';
  const prevTotalRef = useRef(total);

  const phase = useSharedValue(total);
  const rotation = useSharedValue(0);
  const [displayPhase, setDisplayPhase] = useState(total);

  useAnimatedReaction(
    () => phase.value,
    (value) => {
      runOnJS(setDisplayPhase)(value);
    },
    [],
  );

  useEffect(() => {
    const prev = prevTotalRef.current;
    if (total === prev + 1) {
      phase.value = prev;
      phase.value = withTiming(total, {
        duration: ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
      });
      rotation.value = withSequence(
        withTiming(ROTATION_DEG, {
          duration: ANIMATION_MS * 0.45,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0, {
          duration: ANIMATION_MS * 0.55,
          easing: Easing.inOut(Easing.quad),
        }),
      );
    } else {
      phase.value = total;
      rotation.value = 0;
      setDisplayPhase(total);
    }
    prevTotalRef.current = total;
  }, [total, phase, rotation]);

  const beads = useMemo(
    () => computeBeadPositions(MALA_BEADS_LAYOUT_WIDTH, MALA_BEADS_LAYOUT_HEIGHT, displayPhase),
    [displayPhase],
  );

  const threadPath = useMemo(
    () => malaThreadPath(MALA_BEADS_LAYOUT_WIDTH, MALA_BEADS_LAYOUT_HEIGHT),
    [],
  );

  const strandStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleIncrement = useCallback(() => {
    if (enabled) onIncrement();
  }, [enabled, onIncrement]);

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(handleIncrement)();
  });

  const pan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-12, 12])
    .onEnd((e) => {
      const leftward = e.translationX <= -SWIPE_DISTANCE || e.velocityX <= -SWIPE_VELOCITY;
      if (leftward) runOnJS(handleIncrement)();
    });

  const gesture = Gesture.Simultaneous(tap, pan);

  return (
    <GestureDetector gesture={gesture}>
      <View
        className="h-[220px] w-full items-center justify-center"
        style={{ opacity: enabled ? 1 : 0.5 }}
        accessibilityRole="button"
        accessibilityState={{ disabled: !enabled }}
      >
        <Animated.View
          className="h-[220px] w-[360px] overflow-hidden"
          style={strandStyle}
        >
          <Svg
            width={MALA_BEADS_LAYOUT_WIDTH}
            height={MALA_BEADS_LAYOUT_HEIGHT}
            style={{ position: 'absolute' }}
            pointerEvents="none"
          >
            <Path
              d={threadPath}
              stroke={threadColor}
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
              opacity={0.9}
            />
          </Svg>
          {beads.map((bead) => (
            <BeadCircle
              key={`bead-slot-${bead.slot}`}
              x={bead.x}
              y={bead.y}
              radius={bead.radius}
              beadImage={beadImage}
              beadColor={beadColor}
            />
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

function MalaBeadsWithTexture({
  imageUrl,
  onVisualReady,
  ...shellProps
}: MalaBeadsShellInput & { imageUrl: string; onVisualReady?: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const beadImage = useImage(
    imageUrl,
    {
      maxWidth: BEAD_TEXTURE_MAX,
      maxHeight: BEAD_TEXTURE_MAX,
      onError: () => setImageFailed(true),
    },
    [imageUrl],
  );

  const beadTexture = imageFailed ? null : beadImage;

  useEffect(() => {
    if (beadTexture || imageFailed) {
      onVisualReady?.();
    }
  }, [beadTexture, imageFailed, onVisualReady]);

  return <MalaBeadsShell {...shellProps} beadImage={beadTexture} />;
}

export function MalaBeads({
  total,
  beadImageUrl,
  enabled = true,
  onIncrement,
  onVisualReady,
}: MalaBeadsProps) {
  const normalizedUrl = normalizeBeadImageUrl(beadImageUrl);

  useEffect(() => {
    if (!normalizedUrl) {
      onVisualReady?.();
    }
  }, [normalizedUrl, onVisualReady]);

  if (normalizedUrl) {
    return (
      <MalaBeadsWithTexture
        imageUrl={normalizedUrl}
        total={total}
        enabled={enabled}
        onIncrement={onIncrement}
        onVisualReady={onVisualReady}
      />
    );
  }

  return (
    <MalaBeadsShell
      total={total}
      enabled={enabled}
      onIncrement={onIncrement}
      beadImage={null}
    />
  );
}
