import * as Sharing from 'expo-sharing';
import type { TFunction } from 'i18next';
import { Alert } from 'react-native';
import type { ViewShotRef } from 'react-native-view-shot';

export async function captureAndShareStreak(
  viewShotRef: ViewShotRef | null,
  t: TFunction,
): Promise<boolean> {
  if (!viewShotRef?.capture) return false;

  try {
    const uri = await viewShotRef.capture();
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert(t('me.streak_share_error'));
      return false;
    }
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: t('me.share_this_streak'),
    });
    return true;
  } catch {
    Alert.alert(t('me.streak_share_error'));
    return false;
  }
}
