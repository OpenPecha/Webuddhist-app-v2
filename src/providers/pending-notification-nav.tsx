import type { NotificationNavPayload } from '@/lib/notifications/notification-payload';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface PendingNotificationNavContextValue {
  pending: NotificationNavPayload | null;
  setPendingNav: (nav: NotificationNavPayload | null) => void;
  consumePendingNav: () => NotificationNavPayload | null;
}

const PendingNotificationNavContext = createContext<PendingNotificationNavContextValue | null>(
  null,
);

export function PendingNotificationNavProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<NotificationNavPayload | null>(null);

  const setPendingNav = useCallback((nav: NotificationNavPayload | null) => {
    setPending(nav);
  }, []);

  const consumePendingNav = useCallback(() => {
    let consumed: NotificationNavPayload | null = null;
    setPending((current) => {
      consumed = current;
      return null;
    });
    return consumed;
  }, []);

  const value = useMemo(
    () => ({ pending, setPendingNav, consumePendingNav }),
    [pending, setPendingNav, consumePendingNav],
  );

  return (
    <PendingNotificationNavContext.Provider value={value}>
      {children}
    </PendingNotificationNavContext.Provider>
  );
}

export function usePendingNotificationNav() {
  const ctx = useContext(PendingNotificationNavContext);
  if (!ctx) {
    throw new Error('usePendingNotificationNav must be used within PendingNotificationNavProvider');
  }
  return ctx;
}
