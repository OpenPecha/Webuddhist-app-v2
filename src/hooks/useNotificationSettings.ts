import { requestNotificationPermissions } from '@/lib/notifications';
import { StorageKeys, getBoolean, setBoolean } from '@/lib/storage';
import { useTriggerNotificationSync } from '@/hooks/useTriggerNotificationSync';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { showAppToast } from '@/utils/show-app-toast';

export function useNotificationSettings() {
  const { t } = useTranslation();
  const triggerSync = useTriggerNotificationSync();
  const [master, setMaster] = useState(true);
  const [routine, setRoutine] = useState(true);
  const [recitation, setRecitation] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const refreshPermission = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === 'granted');
  }, []);

  useEffect(() => {
    Promise.all([
      getBoolean(StorageKeys.notificationMasterEnabled),
      getBoolean(StorageKeys.notificationRoutineEnabled),
      getBoolean(StorageKeys.notificationRecitationEnabled),
      refreshPermission(),
    ]).then(([masterVal, routineVal, recitationVal]) => {
      setMaster(masterVal ?? true);
      setRoutine(routineVal ?? true);
      setRecitation(recitationVal ?? true);
      setLoaded(true);
    });
  }, [refreshPermission]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshPermission();
    });
    return () => sub.remove();
  }, [refreshPermission]);

  const updateMaster = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermissions();
      setHasPermission(granted);
      if (!granted) {
        showAppToast(t('notifications.permission_denied'));
        await Linking.openSettings();
        return false;
      }
    }
    setMaster(enabled);
    await setBoolean(StorageKeys.notificationMasterEnabled, enabled);
    if (!enabled) {
      setRoutine(false);
      setRecitation(false);
      await setBoolean(StorageKeys.notificationRoutineEnabled, false);
      await setBoolean(StorageKeys.notificationRecitationEnabled, false);
    }
    await triggerSync('masterToggle');
    return true;
  }, [t, triggerSync]);

  const updateRoutine = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        const ok = await updateMaster(true);
        if (!ok) return;
      }
      setRoutine(enabled);
      await setBoolean(StorageKeys.notificationRoutineEnabled, enabled);
      await triggerSync('routineToggle');
    },
    [triggerSync, updateMaster],
  );

  const updateRecitation = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        const ok = await updateMaster(true);
        if (!ok) return;
      }
      setRecitation(enabled);
      await setBoolean(StorageKeys.notificationRecitationEnabled, enabled);
      await triggerSync('recitationToggle');
    },
    [triggerSync, updateMaster],
  );

  const openBatterySettings = useCallback(async () => {
    if (Platform.OS === 'android') {
      await Linking.openSettings();
    }
  }, []);

  return {
    loaded,
    master,
    routine,
    recitation,
    hasPermission,
    updateMaster,
    updateRoutine,
    updateRecitation,
    openBatterySettings,
  };
}
