import * as Haptics from 'expo-haptics';

/**
 * Defensive haptics wrappers. The native ExpoHaptics module is only present in a
 * rebuilt dev client, so every call is guarded to no-op (rather than crash) when
 * the module is unavailable or the platform doesn't support it.
 */

export function hapticSelection(): void {
  try {
    void Haptics.selectionAsync();
  } catch {
    // no-op when native module is unavailable
  }
}

export function hapticLight(): void {
  try {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // no-op when native module is unavailable
  }
}
