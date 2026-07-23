import { appT } from '@/lib/tolgee';

const LANGUAGE_KEYS: Record<string, string> = {
  en: 'english',
  zh: 'chinese',
  lzh: 'classicalChinese',
  bo: 'tibetan',
  sa: 'sanskrit',
  pi: 'pali',
};

const LANGUAGE_FALLBACK: Record<string, string> = {
  hi: 'Hindi',
  ne: 'Nepali',
  mn: 'Mongolian',
};

export function languageDisplayName(code: string): string {
  if (!code) return '';
  const normalized = code.toLowerCase();
  const key = LANGUAGE_KEYS[normalized];
  if (key) return appT(key);
  return LANGUAGE_FALLBACK[normalized] ?? code.toUpperCase();
}

export interface LanguageGroup<T> {
  language: string;
  items: T[];
}

/**
 * Group resource items by language, ordering the reader's text language first,
 * then remaining languages alphabetically (Flutter reader panel parity).
 */
export function groupByLanguage<T extends { language: string }>(
  items: T[],
  primaryLanguage?: string,
): LanguageGroup<T>[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = item.language || '';
    const list = groups.get(key);
    if (list) list.push(item);
    else groups.set(key, [item]);
  }

  const primary = (primaryLanguage ?? '').toLowerCase();
  const codes = [...groups.keys()];
  codes.sort((a, b) => {
    const al = a.toLowerCase();
    const bl = b.toLowerCase();
    if (al === primary && bl !== primary) return -1;
    if (bl === primary && al !== primary) return 1;
    return al.localeCompare(bl);
  });

  return codes.map((language) => ({ language, items: groups.get(language) ?? [] }));
}
