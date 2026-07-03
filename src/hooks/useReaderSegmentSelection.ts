import { useCallback, useState } from 'react';
import type { DetailTextSegment } from '@/types/texts';

export interface SelectedSegment {
  segmentId: string;
  content: string;
  textId: string;
}

export function useReaderSegmentSelection(textId: string) {
  const [selected, setSelected] = useState<SelectedSegment | null>(null);

  const toggle = useCallback(
    (segment: DetailTextSegment) => {
      if (!segment.content?.trim()) return;
      setSelected((current) => {
        if (current?.segmentId === segment.segment_id) return null;
        return {
          segmentId: segment.segment_id,
          content: segment.content ?? '',
          textId,
        };
      });
    },
    [textId],
  );

  const clear = useCallback(() => setSelected(null), []);

  return {
    selected,
    selectedSegmentId: selected?.segmentId ?? null,
    toggle,
    clear,
  };
}
