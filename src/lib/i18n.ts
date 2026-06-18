import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import bo from '@/locales/bo.json';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import mn from '@/locales/mn.json';
import ne from '@/locales/ne.json';
import zh from '@/locales/zh.json';
import { supportedLanguages } from '@/constants/app-config';
import { StorageKeys, getString } from '@/lib/storage';

const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
const defaultLng = supportedLanguages.includes(deviceLocale as (typeof supportedLanguages)[number])
  ? deviceLocale
  : 'en';

async function resolveInitialLanguage(): Promise<string> {
  const stored = await getString(StorageKeys.preferredLanguage);
  if (stored && supportedLanguages.includes(stored as (typeof supportedLanguages)[number])) {
    return stored;
  }
  return defaultLng;
}

const i18nReady = resolveInitialLanguage().then((lng) => {
  if (!i18n.isInitialized) {
    return i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        bo: { translation: bo },
        zh: { translation: zh },
        hi: { translation: hi },
        mn: { translation: mn },
        ne: { translation: ne },
      },
      lng,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
  }
  return i18n.changeLanguage(lng);
});

export async function ensureI18nReady(): Promise<void> {
  await i18nReady;
}

export async function changeAppLanguage(code: string): Promise<void> {
  await ensureI18nReady();
  await i18n.changeLanguage(code);
}

export { supportedLanguages };
export default i18n;
