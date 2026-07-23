import { appT } from '@/lib/tolgee';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import type { ViewShotRef } from 'react-native-view-shot';

export async function captureAndShareStreak(
  viewShotRef: ViewShotRef | null,
): Promise<boolean> {
  if (!viewShotRef?.capture) return false;

  try {
    const uri = await viewShotRef.capture();
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert(appT('me_streak_share_error'));
      return false;
    }
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: appT('share_this_streak'),
    });
    return true;
  } catch {
    Alert.alert(appT('me_streak_share_error'));
    return false;
  }
}
