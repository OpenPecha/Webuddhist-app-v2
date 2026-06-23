import { malaSyncManager } from '@/services/mala/mala-sync-manager';
import { useGuest } from '@/providers/guest';
import { useAuth0 } from 'react-native-auth0';
import { AppState, type AppStateStatus } from 'react-native';
import { useEffect } from 'react';

/** App-scoped mala sync lifecycle (mirrors Flutter MalaSyncManager). */
export function MalaSyncBootstrap() {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isLoggedIn = !!user && !isGuest;

  useEffect(() => {
    malaSyncManager.configure(() => isLoggedIn);
    if (isLoggedIn) {
      malaSyncManager.start();
    } else {
      malaSyncManager.stop();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'background' || next === 'inactive') {
        malaSyncManager.onBackground();
      }
    });
    return () => sub.remove();
  }, []);

  return null;
}
