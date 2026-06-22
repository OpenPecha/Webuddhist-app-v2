import { useThemeColors } from '@/hooks/useThemeColors';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const TRACK_LIGHT = '#DADADA';

interface TimerProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children: ReactNode;
}

export function TimerProgressRing({
  progress,
  size = 280,
  strokeWidth = 3,
  children,
}: TimerProgressRingProps) {
  const { foreground, cardBorder, isDark } = useThemeColors();
  const trackColor = isDark ? cardBorder : TRACK_LIGHT;
  const progressColor = foreground;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {clamped > 0 ? (
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            rotation={-90}
            origin={`${cx}, ${cy}`}
          />
        ) : null}
      </Svg>
      {children}
    </View>
  );
}
