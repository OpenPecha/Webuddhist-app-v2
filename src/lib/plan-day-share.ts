import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
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
  t: any,
): Promise<boolean> {
  const url = shareableImageUrl?.trim();
  if (!url) return false;

  let file: File | null = null;
  try {
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert("Error sharing image");
      return false;
    }

    file = await File.downloadFileAsync(url, new Directory(Paths.cache));

    await Sharing.shareAsync(file.uri, {
      mimeType: mimeTypeFromUrl(url),
      dialogTitle: "Share",
    });
    return true;
  } catch {
    Alert.alert("Error sharing image");
    return false;
  } finally {
    try {
      file?.delete();
    } catch {
      // Best-effort cleanup of the temp file.
    }
  }
}
