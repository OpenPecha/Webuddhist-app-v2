import type { UserPlan } from '@/types/plans';
import React, { createContext, useCallback, useContext, useRef } from 'react';

interface PendingOnboardingPlanContextValue {
  setPendingPlan: (plan: UserPlan | null) => void;
  consumePendingPlan: () => UserPlan | null;
}

const PendingOnboardingPlanContext = createContext<PendingOnboardingPlanContextValue>({
  setPendingPlan: () => {},
  consumePendingPlan: () => null,
});

export function PendingOnboardingPlanProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pendingPlanRef = useRef<UserPlan | null>(null);

  const setPendingPlan = useCallback((plan: UserPlan | null) => {
    pendingPlanRef.current = plan;
  }, []);

  const consumePendingPlan = useCallback(() => {
    const plan = pendingPlanRef.current;
    pendingPlanRef.current = null;
    return plan;
  }, []);

  return (
    <PendingOnboardingPlanContext.Provider
      value={{ setPendingPlan, consumePendingPlan }}
    >
      {children}
    </PendingOnboardingPlanContext.Provider>
  );
}

export function usePendingOnboardingPlan() {
  return useContext(PendingOnboardingPlanContext);
}
