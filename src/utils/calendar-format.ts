/** Converts API hyphenated designation to title case — mirrors Flutter formatDesignation. */
export function formatDesignation(raw: string | null | undefined): string {
  if (!raw?.trim()) return '';
  return raw
    .split('-')
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function parseCalendarDayJson(json: Record<string, unknown>) {
  const lunarMonth = json.lunar_month as Record<string, unknown> | undefined;
  const newYear = json.new_year as Record<string, unknown> | undefined;

  return {
    gregorianDate: (json.gregorian_date as string | null) ?? null,
    lunarDay: Number(json.lunar_day ?? 0),
    lunarMonth: Number(lunarMonth?.month ?? 0),
    monthDesignation: formatDesignation(lunarMonth?.designation as string | undefined),
    yearDesignation: formatDesignation(newYear?.designation as string | undefined),
  };
}
