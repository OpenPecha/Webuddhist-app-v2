export type MoonPhase =
  | 'newMoon'
  | 'waxingCrescent'
  | 'firstQuarter'
  | 'waxingGibbous'
  | 'fullMoon'
  | 'waningGibbous'
  | 'lastQuarter'
  | 'waningCrescent';

/** Maps Tibetan lunar day (1–30) to moon phase — mirrors Flutter moon_phase.dart. */
export function moonPhaseForLunarDay(lunarDay: number): MoonPhase {
  const day = Math.min(30, Math.max(1, lunarDay));
  if (day === 1 || day === 30) return 'newMoon';
  if (day <= 7) return 'waxingCrescent';
  if (day === 8) return 'firstQuarter';
  if (day <= 14) return 'waxingGibbous';
  if (day === 15) return 'fullMoon';
  if (day <= 21) return 'waningGibbous';
  if (day === 22) return 'lastQuarter';
  return 'waningCrescent';
}

export function moonPhaseEmoji(phase: MoonPhase): string {
  switch (phase) {
    case 'newMoon':
      return '🌑';
    case 'waxingCrescent':
      return '🌒';
    case 'firstQuarter':
      return '🌓';
    case 'waxingGibbous':
      return '🌔';
    case 'fullMoon':
      return '🌕';
    case 'waningGibbous':
      return '🌖';
    case 'lastQuarter':
      return '🌗';
    case 'waningCrescent':
      return '🌘';
  }
}

/** Whether a moon phase should be surfaced in the UI — mirrors Flutter showsMoonPhaseLabel. */
export function showsMoonPhaseLabel(phase: MoonPhase): boolean {
  return phase === 'newMoon' || phase === 'firstQuarter' || phase === 'fullMoon';
}
