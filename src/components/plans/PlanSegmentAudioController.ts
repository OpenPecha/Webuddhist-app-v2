import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { requireOptionalNativeModule } from 'expo-modules-core';
import type { EventSubscription } from 'expo-modules-core';

export type PlanAudioButtonState = 'play' | 'loading' | 'pause';

export interface PlanSegmentAudioControllerOptions {
  url?: string | null;
  startMs?: number | null;
  endMs?: number | null;
  onSegmentComplete?: () => void;
  onStateChange?: (state: PlanAudioButtonState, isPlaying: boolean) => void;
}

export interface PlanSegmentAudioController {
  cancel: () => void;
  dispose: () => void;
  toggle: () => void;
  maybeAutoPlay: () => void;
  hasAudio: boolean;
  buttonState: PlanAudioButtonState;
}

export function createPlanSegmentAudioController(
  options: PlanSegmentAudioControllerOptions,
): PlanSegmentAudioController {
  let audioSessionId = 0;
  let hasCompleted = false;
  let isDisposed = false;
  let nativePlayer: AudioPlayer | null = null;
  let statusSub: EventSubscription | null = null;
  let buttonState: PlanAudioButtonState = 'play';

  const setButtonState = (state: PlanAudioButtonState) => {
    if (isDisposed || buttonState === state) return;
    buttonState = state;
    options.onStateChange?.(state, state === 'pause');
  };

  const releasePlayer = () => {
    statusSub?.remove();
    statusSub = null;
    if (nativePlayer) {
      try {
        nativePlayer.pause();
        nativePlayer.remove();
      } catch {
        // Player may already be released.
      }
      nativePlayer = null;
    }
  };

  const fireSegmentComplete = () => {
    if (hasCompleted || isDisposed) return;
    hasCompleted = true;
    options.onSegmentComplete?.();
  };

  const onPlaybackStatus = (status: AudioStatus) => {
    if (isDisposed || buttonState !== 'pause') return;
    if (status.isBuffering) return;

    const endMs = options.endMs;
    if (endMs != null && status.currentTime * 1000 >= endMs) {
      nativePlayer?.pause();
      fireSegmentComplete();
      setButtonState('play');
      return;
    }

    if (status.didJustFinish || status.playbackState === 'finished') {
      fireSegmentComplete();
      setButtonState('play');
      return;
    }

    if (!status.playing && status.isLoaded) {
      setButtonState('play');
    }
  };

  const startAudio = async () => {
    const url = options.url;
    if (!url || buttonState === 'loading' || isDisposed) return;

    if (requireOptionalNativeModule('ExpoAudio') == null) return;

    const sessionId = ++audioSessionId;
    setButtonState('loading');

    try {
      const { createAudioPlayer, setAudioModeAsync } = await import('expo-audio');
      if (isDisposed || sessionId !== audioSessionId) return;

      await setAudioModeAsync({ playsInSilentMode: true });
      if (isDisposed || sessionId !== audioSessionId) return;

      releasePlayer();
      nativePlayer = createAudioPlayer({ uri: url });
      statusSub = nativePlayer.addListener('playbackStatusUpdate', onPlaybackStatus);

      const startSec = (options.startMs ?? 0) / 1000;
      await nativePlayer.seekTo(startSec);
      if (isDisposed || sessionId !== audioSessionId) return;

      hasCompleted = false;
      nativePlayer.play();
      setButtonState('pause');
    } catch {
      if (!isDisposed && sessionId === audioSessionId) {
        setButtonState('play');
      }
    }
  };

  const cancel = () => {
    audioSessionId++;
    hasCompleted = true;
    releasePlayer();
    if (!isDisposed) {
      setButtonState('play');
    }
  };

  const dispose = () => {
    if (isDisposed) return;
    isDisposed = true;
    cancel();
  };

  const toggle = () => {
    if (!options.url || isDisposed) return;
    switch (buttonState) {
      case 'loading':
        return;
      case 'pause':
        nativePlayer?.pause();
        setButtonState('play');
        return;
      case 'play':
        if (!nativePlayer) {
          void startAudio();
          return;
        }
        if (!nativePlayer.isLoaded || nativePlayer.currentTime >= (nativePlayer.duration || 0)) {
          void startAudio();
          return;
        }
        hasCompleted = false;
        nativePlayer.play();
        setButtonState('pause');
    }
  };

  const maybeAutoPlay = () => {
    if (!options.url || isDisposed) return;
    void startAudio();
  };

  return {
    cancel,
    dispose,
    toggle,
    maybeAutoPlay,
    get hasAudio() {
      return !!options.url;
    },
    get buttonState() {
      return buttonState;
    },
  };
}
