import {
  supportedLanguages,
  type SupportedLanguage,
} from "@/constants/app-config";
import en from "@/i18n/en.json";
import { StorageKeys, getString, setString } from "@/lib/storage";
import { FormatIcu } from "@tolgee/format-icu";
import { BackendFetch, Tolgee, useTolgee } from "@tolgee/react";
import { getLocales } from "expo-localization";

const CDN_URL = process.env.EXPO_PUBLIC_TOLGEE_CDN_URL;

const availableLanguages = [
  "en",
  "bo-IN",
  "zh-Hant-TW",
  "hi",
  "mn",
  "ne",
] as const;
type TolgeeLanguage = (typeof availableLanguages)[number];

const staticData = { en };

const APP_TO_TOLGEE: Record<SupportedLanguage, TolgeeLanguage> = {
  en: "en",
  zh: "zh-Hant-TW",
  bo: "bo-IN",
  hi: "hi",
  mn: "mn",
  ne: "ne",
};

function toTolgeeLanguage(code: string): TolgeeLanguage {
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
  availableLanguages: [...availableLanguages],
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
