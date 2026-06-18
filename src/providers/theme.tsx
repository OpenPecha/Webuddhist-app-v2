import { StorageKeys, getString, setString } from '@/lib/storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Uniwind, useUniwind } from 'uniwind';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  isResolved: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleDarkLight: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'system',
  isDark: false,
  isResolved: false,
  setMode: async () => {},
  toggleDarkLight: async () => {},
});

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return Uniwind.currentTheme === 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUniwind();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    getString(StorageKeys.themeMode).then((stored) => {
      const next =
        stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
      Uniwind.setTheme(next);
      setModeState(next);
      setIsResolved(true);
    });
  }, []);

  const setMode = useCallback(async (next: ThemeMode) => {
    Uniwind.setTheme(next);
    await setString(StorageKeys.themeMode, next);
    setModeState(next);
  }, []);

  const toggleDarkLight = useCallback(async () => {
    const isDark = resolveIsDark(mode === 'system' ? 'system' : mode);
    const next: ThemeMode = isDark || theme === 'dark' ? 'light' : 'dark';
    await setMode(next);
  }, [mode, setMode, theme]);

  const isDark = mode === 'system' ? theme === 'dark' : mode === 'dark';

  return (
    <ThemeContext.Provider value={{ mode, isDark, isResolved, setMode, toggleDarkLight }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeContext);
