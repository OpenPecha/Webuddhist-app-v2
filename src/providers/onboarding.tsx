import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ONBOARDING_KEY = 'onboarding_completed';

interface OnboardingContextValue {
  isCompleted: boolean;
  isResolved: boolean;
  markCompleted: () => Promise<void>;
  reset: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue>({
  isCompleted: false,
  isResolved: false,
  markCompleted: async () => {},
  reset: async () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(ONBOARDING_KEY)
      .then((val) => setIsCompleted(val === 'true'))
      .finally(() => setIsResolved(true));
  }, []);

  const markCompleted = useCallback(async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    setIsCompleted(true);
  }, []);

  const reset = useCallback(async () => {
    await SecureStore.deleteItemAsync(ONBOARDING_KEY);
    setIsCompleted(false);
  }, []);

  return (
    <OnboardingContext.Provider value={{ isCompleted, isResolved, markCompleted, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
