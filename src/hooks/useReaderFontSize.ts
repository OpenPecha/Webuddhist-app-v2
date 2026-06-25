import { getString, setString, StorageKeys } from '@/lib/storage';
import { useCallback, useEffect, useState } from 'react';

/** Mirrors Flutter `ReaderFontSizeBottomSheet.fontSizeSteps`. */
export const READER_FONT_SIZE_STEPS = [12, 14, 18, 22, 28, 36, 44] as const;

export const DEFAULT_READER_FONT_SIZE = 18;

function stepIndex(size: number): number {
  for (let i = 0; i < READER_FONT_SIZE_STEPS.length; i++) {
    if (Math.abs(size - READER_FONT_SIZE_STEPS[i]) < 0.5) return i;
  }
  let closest = READER_FONT_SIZE_STEPS.indexOf(DEFAULT_READER_FONT_SIZE);
  let minDiff = Math.abs(size - READER_FONT_SIZE_STEPS[closest]);
  for (let i = 0; i < READER_FONT_SIZE_STEPS.length; i++) {
    const diff = Math.abs(size - READER_FONT_SIZE_STEPS[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = i;
    }
  }
  return closest;
}

function normalizeFontSize(raw: string | null): number {
  if (raw == null) return DEFAULT_READER_FONT_SIZE;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return DEFAULT_READER_FONT_SIZE;
  return READER_FONT_SIZE_STEPS[stepIndex(parsed)];
}

export function useReaderFontSize() {
  const [fontSize, setFontSize] = useState(DEFAULT_READER_FONT_SIZE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getString(StorageKeys.fontSize).then((raw) => {
      if (cancelled) return;
      setFontSize(normalizeFontSize(raw));
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const currentIndex = stepIndex(fontSize);
  const canDecrease = currentIndex > 0;
  const canIncrease = currentIndex < READER_FONT_SIZE_STEPS.length - 1;

  const persist = useCallback((size: number) => {
    void setString(StorageKeys.fontSize, String(size));
  }, []);

  const decrease = useCallback(() => {
    if (!canDecrease) return;
    const next = READER_FONT_SIZE_STEPS[currentIndex - 1];
    setFontSize(next);
    persist(next);
  }, [canDecrease, currentIndex, persist]);

  const increase = useCallback(() => {
    if (!canIncrease) return;
    const next = READER_FONT_SIZE_STEPS[currentIndex + 1];
    setFontSize(next);
    persist(next);
  }, [canIncrease, currentIndex, persist]);

  return {
    fontSize,
    loaded,
    canDecrease,
    canIncrease,
    decrease,
    increase,
  };
}
