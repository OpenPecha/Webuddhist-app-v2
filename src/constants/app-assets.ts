/**
 * Image paths and Phosphor icon mappings aligned with Flutter `AppAssets`
 * (WeBuddhist-app/lib/core/constants/app_assets.dart).
 */
import type { MoonPhase } from '@/utils/moon-phase';
import type { IconProps } from 'phosphor-react-native';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CalendarDots,
  ListChecks,
  ShareNetwork,
  Timer,
} from 'phosphor-react-native';
import type { ComponentType } from 'react';

export const APP_ASSETS = {
  routineCalendar: require('../../assets/images/routine_calendar.png'),
  recitationCoverDefault: require('../../assets/images/recitation_cover/recitation_05.jpg'),
  malaIcon: require('../../assets/images/mala-icon.png'),
  seriesCoverFallback: require('../../assets/images/tag_cover/cover_image.jpg'),
  connect: require('../../assets/images/connect.jpg'),
} as const;

/** Moon phase PNGs — `MoonPhaseIcon` falls back to `PaintedMoon` on load error. */
export const MOON_PHASE_ASSETS: Record<MoonPhase, number> = {
  newMoon: require('../../assets/images/moon/new_moon.png'),
  waxingCrescent: require('../../assets/images/moon/waxing_crescent.png'),
  firstQuarter: require('../../assets/images/moon/first_quarter.png'),
  waxingGibbous: require('../../assets/images/moon/waxing_gibbous.png'),
  fullMoon: require('../../assets/images/moon/full_moon.png'),
  waningGibbous: require('../../assets/images/moon/waning_gibbous.png'),
  lastQuarter: require('../../assets/images/moon/last_quarter.png'),
  waningCrescent: require('../../assets/images/moon/waning_crescent.png'),
};

/** Phosphor icon components mapped from Flutter `AppAssets` home / common icons. */
export const PHOSPHOR_ICONS = {
  homeChants: BookOpenText,
  homeTimer: Timer,
  homeList: ListChecks,
  bookOpenText: BookOpenText,
  calendarDots: CalendarDots,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  shareNetwork: ShareNetwork,
} as const satisfies Record<string, ComponentType<IconProps>>;

