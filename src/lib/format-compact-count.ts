/** Compact number formatting matching Flutter MeStatsSection. */
export function formatCompactCount(count: number, locale = 'en'): string {
  if (count >= 1_000_000) {
    const value = count / 1_000_000;
    return `${trimTrailingZero(value.toFixed(1))}M`;
  }
  if (count >= 1_000) {
    const value = count / 1_000;
    return `${trimTrailingZero(value.toFixed(1))}k`;
  }
  return new Intl.NumberFormat(locale).format(count);
}

function trimTrailingZero(value: string): string {
  return value.endsWith('.0') ? value.slice(0, -2) : value;
}
