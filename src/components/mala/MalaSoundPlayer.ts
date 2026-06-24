import { requireOptionalNativeModule } from 'expo-modules-core';

export interface MalaSoundPlayer {
  play: () => void;
}

/** Flutter parity: `assets/audios/mala.wav` (`AppAssets.malaSound`). */
let malaAsset: number | null = null;

try {
  malaAsset = require('../../../assets/audios/mala.wav');
} catch {
  malaAsset = null;
}

export async function createMalaSoundPlayer(): Promise<MalaSoundPlayer | null> {
  if (malaAsset == null) return null;
  if (requireOptionalNativeModule('ExpoAudio') == null) return null;

  try {
    const { createAudioPlayer, setAudioModeAsync } = await import('expo-audio');
    await setAudioModeAsync({ playsInSilentMode: true });
    const player = createAudioPlayer(malaAsset);
    return {
      play: () => {
        void player.seekTo(0).then(() => player.play());
      },
    };
  } catch {
    return null;
  }
}
