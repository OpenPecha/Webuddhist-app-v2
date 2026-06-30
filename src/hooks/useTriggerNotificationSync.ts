import { useContentLanguage } from '@/hooks/useContentLanguage';
import { triggerNotificationSync, type SyncTrigger } from '@/lib/notifications';
import { useGuest } from '@/providers/guest';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuth0 } from 'react-native-auth0';

export function useTriggerNotificationSync() {
  const queryClient = useQueryClient();
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();

  return useCallback(
    (trigger: SyncTrigger) =>
      triggerNotificationSync({
        trigger,
        queryClient,
        language,
        loggedIn: !!user,
        isGuest,
      }),
    [isGuest, language, queryClient, user],
  );
}
