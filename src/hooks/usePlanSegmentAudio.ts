import {
  createPlanSegmentAudioController,
  type PlanAudioButtonState,
} from '@/components/plans/PlanSegmentAudioController';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UsePlanSegmentAudioOptions {
  subTaskId?: string;
  url?: string | null;
  startMs?: number | null;
  endMs?: number | null;
  autoPlay?: boolean;
  onSegmentComplete?: () => void;
}

export function usePlanSegmentAudio({
  subTaskId,
  url,
  startMs,
  endMs,
  autoPlay,
  onSegmentComplete,
}: UsePlanSegmentAudioOptions) {
  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonState, setButtonState] = useState<PlanAudioButtonState>('play');
  const controllerRef = useRef<ReturnType<typeof createPlanSegmentAudioController> | null>(null);
  const onSegmentCompleteRef = useRef(onSegmentComplete);
  onSegmentCompleteRef.current = onSegmentComplete;

  useEffect(() => {
    controllerRef.current?.dispose();
    controllerRef.current = null;
    setReady(false);
    setIsPlaying(false);
    setButtonState('play');

    if (!url) return;

    const controller = createPlanSegmentAudioController({
      url,
      startMs,
      endMs,
      onSegmentComplete: () => onSegmentCompleteRef.current?.(),
      onStateChange: (state, playing) => {
        setButtonState(state);
        setIsPlaying(playing);
      },
    });
    controllerRef.current = controller;
    setReady(controller.hasAudio);

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, [subTaskId, url, startMs, endMs]);

  const cancel = useCallback(() => {
    controllerRef.current?.cancel();
    setIsPlaying(false);
    setButtonState('play');
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        controllerRef.current?.cancel();
        setIsPlaying(false);
        setButtonState('play');
      };
    }, []),
  );

  useEffect(() => {
    if (autoPlay && ready && controllerRef.current) {
      controllerRef.current.maybeAutoPlay();
    }
  }, [autoPlay, ready, subTaskId]);

  const toggle = useCallback(() => {
    controllerRef.current?.toggle();
  }, []);

  return {
    ready,
    isPlaying,
    buttonState,
    toggle,
    cancel,
  };
}
