import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerPhase = 'countdown' | 'running' | 'finished';

const COUNTDOWN_START = 5;

export function formatTimerDuration(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const minutesText = String(minutes).padStart(2, '0');
  const secondsText = String(seconds).padStart(2, '0');
  return `${minutesText} : ${secondsText}`;
}

interface UseActiveTimerOptions {
  totalMs: number;
  onSessionStart?: () => void;
  onComplete?: () => void;
}

export function useActiveTimer({ totalMs, onSessionStart, onComplete }: UseActiveTimerOptions) {
  const [phase, setPhase] = useState<TimerPhase>('countdown');
  const [countdownValue, setCountdownValue] = useState(COUNTDOWN_START);
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);
  const onSessionStartRef = useRef(onSessionStart);
  const onCompleteRef = useRef(onComplete);

  onSessionStartRef.current = onSessionStart;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startMainTimer = useCallback(() => {
    onSessionStartRef.current?.();
    setPhase('running');
    setRemainingMs(totalMs);
    setIsPaused(false);

    clearTimer();
    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      setRemainingMs((prev) => {
        if (prev <= 1000) {
          clearTimer();
          setPhase('finished');
          setIsPaused(false);
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  }, [clearTimer, totalMs]);

  useEffect(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setCountdownValue((prev) => {
        if (prev <= 1) {
          clearTimer();
          startMainTimer();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [clearTimer, startMainTimer]);

  const elapsedMs = totalMs - remainingMs;

  const elapsedProgress =
    phase === 'countdown' || totalMs <= 0
      ? 0
      : phase === 'finished'
        ? 1
        : Math.min(1, Math.max(0, elapsedMs / totalMs));

  const togglePause = useCallback(() => {
    if (phase !== 'running') return;
    setIsPaused((prev) => !prev);
  }, [phase]);

  const stopTimer = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const centerText =
    phase === 'countdown' ? String(countdownValue) : formatTimerDuration(remainingMs);

  const showFinish = phase === 'finished' || (phase === 'running' && isPaused);
  const showDiscard = phase === 'running' && isPaused;
  const showPlayPause = phase !== 'countdown';
  const isPlayIcon = isPaused || phase === 'finished';

  return {
    phase,
    countdownValue,
    remainingMs,
    isPaused,
    elapsedMs,
    elapsedProgress,
    centerText,
    showFinish,
    showDiscard,
    showPlayPause,
    isPlayIcon,
    togglePause,
    stopTimer,
  };
}
