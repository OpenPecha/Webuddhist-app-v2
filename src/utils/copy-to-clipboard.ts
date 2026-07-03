import { Share } from 'react-native';

export interface CopyResult {
  ok: boolean;
  cancelled?: boolean;
  error?: string;
}

/**
 * Copy segment text via the system share sheet (no native clipboard module required).
 * Distinguishes user cancellation from genuine failures so the UI can toast correctly.
 * After rebuilding the dev client with expo-clipboard, this can be upgraded to silent copy.
 */
export async function copyToClipboard(text: string): Promise<CopyResult> {
  try {
    const result = await Share.share({ message: text });
    if (result.action === Share.dismissedAction) {
      return { ok: false, cancelled: true };
    }
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}
