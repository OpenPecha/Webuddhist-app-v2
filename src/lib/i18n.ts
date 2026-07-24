import { FormatIcu } from '@tolgee/format-icu';
import { BackendFetch, DevTools, Tolgee, useTolgee, useTranslate } from '@tolgee/react';
import { useQueryClient } from '@tanstack/react-query';
import { getLocales } from 'expo-localization';
import { useCallback } from 'react';

import localeEn from '@/i18n/en.json';
import {
  supportedLanguages,
  toAppLanguage,
  toTolgeeLanguage,
  type SupportedLanguage,
} from '@/constants/app-config';
import { getString, setString, StorageKeys } from '@/lib/storage';
import { DEFAULT_LANGUAGE } from '@/utils/constant';

const TOLGEE_CDN =
  'https://cdn.tolg.ee/a23495c159b886551292e856ecf7a332/webuddhist';

/** Loose type for the Tolgee `t` passed into helper functions. */
export type TranslateFn = (key: string, defaultValueOrParams?: any, params?: any) => string;

const isSupported = (code: string): code is SupportedLanguage =>
  (supportedLanguages as readonly string[]).includes(code);

/** App/API short code (en, bo, zh, hi, …) — updated synchronously on language change. */
let currentAppLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

function setAppLanguage(code: SupportedLanguage) {
  currentAppLanguage = code;
}

/** App short code for API `?language=` params (never Tolgee CDN tags). */
export function getApiLanguageSync(): SupportedLanguage {
  return currentAppLanguage;
}

/** Shared Tolgee instance. UI strings load from the bundled `en.json` fallback and the CDN. */
export const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatIcu())
  .use(BackendFetch({ prefix: TOLGEE_CDN, fallbackOnFail: true }))
  .init({
    language: DEFAULT_LANGUAGE,
    fallbackLanguage: 'en',
    defaultLanguage: 'en',
    staticData: {
      en: localeEn,
    },
  });

/** Persisted preference → device locale → English (always app short codes). */
export async function resolveInitialLanguage(): Promise<SupportedLanguage> {
  const stored = await getString(StorageKeys.preferredLanguage);
  if (stored && isSupported(stored)) return stored;
  const device = getLocales()[0]?.languageCode ?? DEFAULT_LANGUAGE;
  return isSupported(device) ? device : DEFAULT_LANGUAGE;
}

/** Applies the stored/device language and loads its records before the UI renders. */
export async function initI18n(): Promise<void> {
  const appLanguage = await resolveInitialLanguage();
  setAppLanguage(appLanguage);
  await tolgee.changeLanguage(toTolgeeLanguage(appLanguage));
  await tolgee.run();
}

/** Current app language (en/bo/zh/hi/…), reactive to Tolgee language changes. */
export function useUiLanguage(): SupportedLanguage {
  useTranslate();
  useTolgee(['language']);
  return currentAppLanguage;
}

/**
 * Central language-change orchestrator (mirrors the web `changeLanguage`):
 * 1. Set app/API short code immediately
 * 2. Switch Tolgee UI strings (CDN tags: bo-IN, zh-Hant-TW, …)
 * 3. Persist + invalidate queries so content refetches with the new API code
 */
export function useChangeLanguage() {
  const instance = useTolgee();
  const queryClient = useQueryClient();

  return useCallback(
    async (appCode: SupportedLanguage) => {
      setAppLanguage(appCode);
      await setString(StorageKeys.preferredLanguage, appCode);
      await instance.changeLanguage(toTolgeeLanguage(appCode));
      await queryClient.invalidateQueries();
    },
    [instance, queryClient],
  );
}
