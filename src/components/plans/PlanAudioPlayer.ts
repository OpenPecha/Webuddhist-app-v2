import { requireOptionalNativeModule } from 'expo-modules-core';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface PlanAudioPlayer {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  isPlaying: boolean;
}

export async function createPlanAudioPlayer(url: string): Promise<PlanAudioPlayer | null> {
  if (!url || requireOptionalNativeModule('ExpoAudio') == null) return null;

  try {
    const { createAudioPlayer, setAudioModeAsync } = await import('expo-audio');
    await setAudioModeAsync({ playsInSilentMode: true });
    const player = createAudioPlayer({ uri: url });
    return {
      play: () => player.play(),
      pause: () => player.pause(),
      toggle: () => {
        if (player.playing) player.pause();
        else player.play();
      },
      isPlaying: player.playing,
    };
  } catch {
    return null;
  }
}

export function usePlanAudioPlayer(audioUrl?: string | null) {
  const playerRef = useRef<PlanAudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    playerRef.current = null;
    setReady(false);
    setIsPlaying(false);

    if (!audioUrl) return;

    void createPlanAudioPlayer(audioUrl).then((player) => {
      if (cancelled) return;
      playerRef.current = player;
      setReady(!!player);
    });

    return () => {
      cancelled = true;
      playerRef.current = null;
    };
  }, [audioUrl]);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    player.toggle();
    setIsPlaying((prev) => !prev);
  }, []);

  const play = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    player.play();
    setIsPlaying(true);
  }, []);

  return { ready, isPlaying, toggle, play };
}
