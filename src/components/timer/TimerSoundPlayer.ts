import { requireOptionalNativeModule } from 'expo-modules-core';

export interface TimerSoundPlayer {
  play: () => void;
}

let meditationAsset: number | null = null;

try {
  meditationAsset = require('../../../assets/audios/meditation.mp3');
} catch {
  meditationAsset = null;
}

/** Lazy-loads expo-av only when ExponentAV native module is present in the dev build. */
export async function createTimerSoundPlayer(): Promise<TimerSoundPlayer | null> {
  if (meditationAsset == null) {
    return null;
  }

  if (requireOptionalNativeModule('ExponentAV') == null) {
    return null;
  }

  try {
    const { Audio } = await import('expo-av');
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(meditationAsset);
    return {
      play: () => {
        void sound.setPositionAsync(0).then(() => sound.playAsync());
      },
    };
  } catch (error) {
    console.warn('[TimerSoundPlayer] Failed to load meditation sound:', error);
    return null;
  }
}
