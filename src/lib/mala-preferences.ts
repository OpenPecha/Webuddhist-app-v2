import { getBoolean, setBoolean } from '@/lib/storage';

const KEYS = {
  sound: 'mala_prefs:sound',
  vibration: 'mala_prefs:vibration',
  screenLock: 'mala_prefs:screen_lock',
} as const;

export interface MalaPreferences {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  screenLockEnabled: boolean;
}

export const DEFAULT_MALA_PREFERENCES: MalaPreferences = {
  soundEnabled: true,
  vibrationEnabled: true,
  screenLockEnabled: false,
};

export async function readMalaPreferences(): Promise<MalaPreferences> {
  const [sound, vibration, screenLock] = await Promise.all([
    getBoolean(KEYS.sound),
    getBoolean(KEYS.vibration),
    getBoolean(KEYS.screenLock),
  ]);

  return {
    soundEnabled: sound ?? DEFAULT_MALA_PREFERENCES.soundEnabled,
    vibrationEnabled: vibration ?? DEFAULT_MALA_PREFERENCES.vibrationEnabled,
    screenLockEnabled: screenLock ?? DEFAULT_MALA_PREFERENCES.screenLockEnabled,
  };
}

export async function writeMalaPreference<K extends keyof MalaPreferences>(
  key: K,
  value: MalaPreferences[K],
): Promise<void> {
  const storageKey =
    key === 'soundEnabled'
      ? KEYS.sound
      : key === 'vibrationEnabled'
        ? KEYS.vibration
        : KEYS.screenLock;
  await setBoolean(storageKey, value);
}
