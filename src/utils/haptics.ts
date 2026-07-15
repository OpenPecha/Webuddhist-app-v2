import * as Haptics from 'expo-haptics';

/**
 * Defensive haptics wrappers. The native ExpoHaptics module is only present in a
 * rebuilt dev client, so every call is guarded to no-op (rather than crash) when
 * the module is unavailable or the platform doesn't support it.
 */

export function hapticSelection(): void {
  try {
    // Guard both a synchronous throw AND a rejected promise: when the native
    // ExpoHaptics module is missing (dev client not rebuilt), selectionAsync
    // rejects asynchronously, which would otherwise surface as an uncaught
    // promise rejection.
    Haptics.selectionAsync().catch(() => {});
  } catch {
    // no-op when native module is unavailable
  }
}

export function hapticLight(): void {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  } catch {
    // no-op when native module is unavailable
  }
}
