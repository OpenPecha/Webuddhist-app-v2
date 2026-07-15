import { tibetanLanguageCode } from '@/constants/app-config';
import { toTibetanDigits } from '@/utils/tibetan-numerals';

interface FormatMeditationDurationOptions {
  language: string;
  minuteLabel: string;
  hourLabel: string;
}

/** Mirrors Flutter MeStatsSection._formatDuration. */
export function formatMeditationDuration(
  milliseconds: number,
  { language, minuteLabel, hourLabel }: FormatMeditationDurationOptions,
): string {
  const totalMinutes = Math.round(milliseconds / 60_000);
  const isTibetan = language === tibetanLanguageCode;

  if (totalMinutes < 60) {
    if (isTibetan) {
      return `${minuteLabel} ${toTibetanDigits(totalMinutes)}`;
    }
    return `${totalMinutes}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (isTibetan) {
    if (minutes === 0) {
      return `${hourLabel} ${toTibetanDigits(hours)}`;
    }
    return `${hourLabel} ${toTibetanDigits(hours)} ${minuteLabel} ${toTibetanDigits(minutes)}`;
  }

  if (minutes === 0) return `${hours}hr`;
  return `${hours}hr ${minutes}m`;
}
