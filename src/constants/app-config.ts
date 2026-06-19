export const englishLanguageCode = 'en';
export const chineseLanguageCode = 'zh';
export const tibetanLanguageCode = 'bo';
export const hindiLanguageCode = 'hi';
export const mongolianLanguageCode = 'mn';
export const nepaliLanguageCode = 'ne';

export const supportedLanguages = [
  englishLanguageCode,
  chineseLanguageCode,
  tibetanLanguageCode,
  hindiLanguageCode,
  mongolianLanguageCode,
  nepaliLanguageCode,
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const backendContentLanguages = [
  englishLanguageCode,
  chineseLanguageCode,
  tibetanLanguageCode,
] as const;

/** Native-script labels shown in the language picker (matches Flutter MoreScreen). */
export const languageLabels: Record<SupportedLanguage, string> = {
  en: 'English',
  zh: '中文',
  bo: 'བོད་ཡིག',
  hi: 'हिन्दी',
  mn: 'Монгол',
  ne: 'नेपाली',
};

/** Maps UI locale to the language code sent to content APIs. */
export function resolveContentLanguage(localeCode: string): string {
  const code = localeCode.toLowerCase().split('-')[0];
  if ((backendContentLanguages as readonly string[]).includes(code)) return code;
  return englishLanguageCode;
}

export function getLanguageLabel(code: string): string {
  return languageLabels[code as SupportedLanguage] ?? code;
}
