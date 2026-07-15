import type { MoonPhase } from '@/utils/moon-phase';
import { useThemeColors } from '@/hooks/useThemeColors';
import Svg, { Circle, ClipPath, Defs, G } from 'react-native-svg';

const LIT_LIGHT = '#1C1B1A';
const UNLIT_LIGHT = '#D9D6CE';
const LIT_DARK = '#E0E0E0';
const UNLIT_DARK = '#3A3A3A';

function phaseAge(phase: MoonPhase): number {
  switch (phase) {
    case 'newMoon':
      return 0;
    case 'waxingCrescent':
      return 0.125;
    case 'firstQuarter':
      return 0.25;
    case 'waxingGibbous':
      return 0.375;
    case 'fullMoon':
      return 0.5;
    case 'waningGibbous':
      return 0.625;
    case 'lastQuarter':
      return 0.75;
    case 'waningCrescent':
      return 0.875;
  }
}

interface PaintedMoonProps {
  phase: MoonPhase;
  size?: number;
}

/** SVG fallback mirroring Flutter `_MoonPainter` in moon_phase_icon.dart. */
export function PaintedMoon({ phase, size = 44 }: PaintedMoonProps) {
  const { isDark } = useThemeColors();
  const lit = isDark ? LIT_DARK : LIT_LIGHT;
  const unlit = isDark ? UNLIT_DARK : UNLIT_LIGHT;
  const r = size / 2;
  const age = phaseAge(phase);
  const illum = (1 - Math.cos(2 * Math.PI * age)) / 2;
  const waxing = age <= 0.5;
  const shadowDx = waxing ? r - 2 * r * illum : r + 2 * r * illum;
  const clipId = `moon-clip-${phase}-${size}`;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <ClipPath id={clipId}>
          <Circle cx={r} cy={r} r={r} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${clipId})`}>
        <Circle cx={r} cy={r} r={r} fill={lit} />
        <Circle cx={shadowDx} cy={r} r={r} fill={unlit} />
      </G>
      <Circle
        cx={r}
        cy={r}
        r={r}
        fill="none"
        stroke={lit}
        strokeWidth={1}
        strokeOpacity={0.25}
      />
    </Svg>
  );
}
