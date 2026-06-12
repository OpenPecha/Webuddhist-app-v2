import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import bo from '@/locales/bo.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

const deviceLocale = getLocales()[0]?.languageCode ?? 'en';

const supportedLanguages = ['en', 'bo', 'zh'];
const lng = supportedLanguages.includes(deviceLocale) ? deviceLocale : 'en';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, bo: { translation: bo }, zh: { translation: zh } },
  lng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
