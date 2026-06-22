import { PaintedMoon } from '@/components/home/PaintedMoon';
import { MOON_PHASE_ASSETS } from '@/constants/app-assets';
import type { MoonPhase } from '@/utils/moon-phase';
import { Image } from 'expo-image';
import { useState } from 'react';

interface MoonPhaseIconProps {
  phase: MoonPhase;
  size?: number;
}

export function MoonPhaseIcon({ phase, size = 44 }: MoonPhaseIconProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const asset = MOON_PHASE_ASSETS[phase];

  if (loadFailed) {
    return <PaintedMoon phase={phase} size={size} />;
  }

  return (
    <Image
      source={asset}
      style={{ width: size, height: size }}
      contentFit="contain"
      onError={() => setLoadFailed(true)}
    />
  );
}
