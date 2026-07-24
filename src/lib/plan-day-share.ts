import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import type { TFunction } from "i18next";
import { Alert } from "react-native";

function mimeTypeFromUrl(url: string): string {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

/**
 * Downloads the remote day-completion image and opens the native share sheet
 * with that image file. Mirrors the Flutter `sharePlanDayImage` flow.
 */
export async function sharePlanDayImage(
  shareableImageUrl: string | null | undefined,
  t: TFunction,
): Promise<boolean> {
  const url = shareableImageUrl?.trim();
  if (!url) return false;

  let file: File | null = null;
  try {
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert(t("planTrack.day_share_error"));
      return false;
    }

    file = await File.downloadFileAsync(url, new Directory(Paths.cache));

    await Sharing.shareAsync(file.uri, {
      mimeType: mimeTypeFromUrl(url),
      dialogTitle: t("planTrack.share_this_day"),
    });
    return true;
  } catch {
    Alert.alert(t("planTrack.day_share_error"));
    return false;
  } finally {
    try {
      file?.delete();
    } catch {
      // Best-effort cleanup of the temp file.
    }
  }
}
