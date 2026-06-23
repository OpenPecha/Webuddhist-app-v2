import {
  DEFAULT_MALA_PREFERENCES,
  readMalaPreferences,
  writeMalaPreference,
  type MalaPreferences,
} from '@/lib/mala-preferences';
import { useCallback, useEffect, useState } from 'react';

export function useMalaPreferences() {
  const [prefs, setPrefs] = useState<MalaPreferences>(DEFAULT_MALA_PREFERENCES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void readMalaPreferences().then((next) => {
      setPrefs(next);
      setLoaded(true);
    });
  }, []);

  const setSoundEnabled = useCallback(async (value: boolean) => {
    setPrefs((p) => ({ ...p, soundEnabled: value }));
    await writeMalaPreference('soundEnabled', value);
  }, []);

  const setVibrationEnabled = useCallback(async (value: boolean) => {
    setPrefs((p) => ({ ...p, vibrationEnabled: value }));
    await writeMalaPreference('vibrationEnabled', value);
  }, []);

  const setScreenLockEnabled = useCallback(async (value: boolean) => {
    setPrefs((p) => ({ ...p, screenLockEnabled: value }));
    await writeMalaPreference('screenLockEnabled', value);
  }, []);

  return {
    prefs,
    loaded,
    setSoundEnabled,
    setVibrationEnabled,
    setScreenLockEnabled,
  };
}
