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

/** Lazy-loads expo-audio when the ExpoAudio native module is present in the dev build. */
export async function createTimerSoundPlayer(): Promise<TimerSoundPlayer | null> {
  if (meditationAsset == null) {
    return null;
  }

  if (requireOptionalNativeModule('ExpoAudio') == null) {
    return null;
  }

  try {
    const { createAudioPlayer, setAudioModeAsync } = await import('expo-audio');
    await setAudioModeAsync({ playsInSilentMode: true });
    const player = createAudioPlayer(meditationAsset);
    return {
      play: () => {
        void player.seekTo(0).then(() => {
          player.play();
        });
      },
    };
  } catch (error) {
    console.warn('[TimerSoundPlayer] Failed to load meditation sound:', error);
    return null;
  }
}
