import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const GUEST_KEY = 'is_guest_mode';

interface GuestContextValue {
  isGuest: boolean;
  isResolved: boolean;
  continueAsGuest: () => Promise<void>;
  clearGuest: () => Promise<void>;
}

const GuestContext = createContext<GuestContextValue>({
  isGuest: false,
  isResolved: false,
  continueAsGuest: async () => {},
  clearGuest: async () => {},
});

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(GUEST_KEY)
      .then((val) => setIsGuest(val === 'true'))
      .finally(() => setIsResolved(true));
  }, []);

  const continueAsGuest = useCallback(async () => {
    await SecureStore.setItemAsync(GUEST_KEY, 'true');
    setIsGuest(true);
  }, []);

  const clearGuest = useCallback(async () => {
    await SecureStore.deleteItemAsync(GUEST_KEY);
    setIsGuest(false);
  }, []);

  return (
    <GuestContext.Provider value={{ isGuest, isResolved, continueAsGuest, clearGuest }}>
      {children}
    </GuestContext.Provider>
  );
}

export const useGuest = () => useContext(GuestContext);
