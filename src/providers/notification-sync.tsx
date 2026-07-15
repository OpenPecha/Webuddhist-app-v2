import { useContentLanguage } from '@/hooks/useContentLanguage';
import {
  parseNotificationPayload,
  triggerNotificationSync,
} from '@/lib/notifications';
import { usePendingNotificationNav } from '@/providers/pending-notification-nav';
import { useGuest } from '@/providers/guest';
import { useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

function handleNotificationResponse(
  response: Notifications.NotificationResponse | null,
  setPendingNav: (nav: ReturnType<typeof parseNotificationPayload>) => void,
) {
  if (!response) return;
  const data = response.notification.request.content.data;
  const parsed =
    parseNotificationPayload(data?.payload) ??
    parseNotificationPayload(data) ??
    (typeof data?.planId === 'string'
      ? {
          itemId: data.planId,
          itemType: 'series',
          planId: data.planId,
          day: typeof data.day === 'string' ? data.day : undefined,
        }
      : null);
  if (parsed) setPendingNav(parsed);
}

export function NotificationSyncBootstrap() {
  const queryClient = useQueryClient();
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { setPendingNav } = usePendingNotificationNav();
  const lastLoggedInRef = useRef<boolean | null>(null);

  useEffect(() => {
    void Notifications.getLastNotificationResponseAsync().then((response) => {
      handleNotificationResponse(response, setPendingNav);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationResponse(response, setPendingNav);
    });

    return () => subscription.remove();
  }, [setPendingNav]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      if (!user || isGuest) return;
      void triggerNotificationSync({
        trigger: 'appResume',
        queryClient,
        language,
        loggedIn: !!user,
        isGuest,
      });
    });
    return () => sub.remove();
  }, [isGuest, language, queryClient, user]);

  useEffect(() => {
    const loggedIn = !!user && !isGuest;
    if (lastLoggedInRef.current === loggedIn) return;
    lastLoggedInRef.current = loggedIn;

    void triggerNotificationSync({
      trigger: loggedIn ? 'loggedIn' : 'loggedOut',
      queryClient,
      language,
      loggedIn: !!user,
      isGuest,
    });
  }, [isGuest, language, queryClient, user]);

  return null;
}
