import {
  supportedLanguages,
  type SupportedLanguage,
} from "@/constants/app-config";
import boIN from "@/i18n/bo-IN.json";
import en from "@/i18n/en.json";
import hi from "@/i18n/hi.json";
import mn from "@/i18n/mn.json";
import ne from "@/i18n/ne.json";
import zhHantTW from "@/i18n/zh-Hant-TW.json";
import { StorageKeys, getString, setString } from "@/lib/storage";
import { FormatIcu } from "@tolgee/format-icu";
import { BackendFetch, Tolgee, useTolgee } from "@tolgee/react";
import { getLocales } from "expo-localization";

const CDN_URL = process.env.EXPO_PUBLIC_TOLGEE_CDN_URL;

const staticData = {
  en,
  "bo-IN": boIN,
  "zh-Hant-TW": zhHantTW,
  hi,
  mn,
  ne,
};

const APP_TO_TOLGEE: Record<SupportedLanguage, keyof typeof staticData> = {
  en: "en",
  zh: "zh-Hant-TW",
  bo: "bo-IN",
  hi: "hi",
  mn: "mn",
  ne: "ne",
};

function toTolgeeLanguage(code: string): keyof typeof staticData {
  return APP_TO_TOLGEE[code as SupportedLanguage] ?? "en";
}

function toAppLanguage(tag: string | undefined): SupportedLanguage {
  if (!tag) return "en";
  const found = (Object.keys(APP_TO_TOLGEE) as SupportedLanguage[]).find(
    (code) => APP_TO_TOLGEE[code] === tag,
  );
  if (found) return found;
  const short = tag.split("-")[0] as SupportedLanguage;
  return supportedLanguages.includes(short) ? short : "en";
}

let tg = Tolgee().use(FormatIcu());
if (CDN_URL) {
  tg = tg.use(BackendFetch({ prefix: CDN_URL, fallbackOnFail: true }));
}

export const tolgee = tg.init({
  availableLanguages: Object.keys(staticData),
  defaultLanguage: "en",
  fallbackLanguage: "en",
  staticData,
});

async function resolveInitialAppLanguage(): Promise<SupportedLanguage> {
  const stored = await getString(StorageKeys.preferredLanguage);
  if (stored && supportedLanguages.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }
  const device = getLocales()[0]?.languageCode ?? "en";
  return supportedLanguages.includes(device as SupportedLanguage)
    ? (device as SupportedLanguage)
    : "en";
}

export async function ensureI18nReady(): Promise<void> {
  await tolgee.changeLanguage(
    toTolgeeLanguage(await resolveInitialAppLanguage()),
  );
  await tolgee.run();
}

export async function changeAppLanguage(code: string): Promise<void> {
  await tolgee.changeLanguage(toTolgeeLanguage(code));
  await setString(StorageKeys.preferredLanguage, code);
}

export function useAppLanguage(): SupportedLanguage {
  return toAppLanguage(useTolgee(["language"]).getLanguage());
}
