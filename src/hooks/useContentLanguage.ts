import { useUiLanguage } from '@/lib/i18n';

/** App short code for API `?language=` params (en, bo, zh, hi, … — never Tolgee CDN tags). */
export function useContentLanguage(): string {
  return useUiLanguage();
}
