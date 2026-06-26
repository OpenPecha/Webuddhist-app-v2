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
  const controllerSubTaskIdRef = useRef<string | undefined>(undefined);
  const onSegmentCompleteRef = useRef(onSegmentComplete);
  onSegmentCompleteRef.current = onSegmentComplete;

  useEffect(() => {
    controllerRef.current?.dispose();
    controllerRef.current = null;
    controllerSubTaskIdRef.current = undefined;
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
    controllerSubTaskIdRef.current = subTaskId;
    setReady(controller.hasAudio);

    return () => {
      controller.dispose();
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        controllerSubTaskIdRef.current = undefined;
      }
    };
  }, [subTaskId, url, startMs, endMs]);

  const cancel = useCallback(() => {
    controllerRef.current?.cancel();
    setIsPlaying(false);
    setButtonState('play');
  }, []);

  useFocusEffect(
    useCallback(() => {
      const focusedSubTaskId = subTaskId;
      return () => {
        if (controllerSubTaskIdRef.current !== focusedSubTaskId) return;
        controllerRef.current?.cancel();
        setIsPlaying(false);
        setButtonState('play');
      };
    }, [subTaskId]),
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
