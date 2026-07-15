import { ReaderSegmentBlock } from '@/components/reader/ReaderSegmentBlock';
import type { DetailTextSegment } from '@/types/texts';
import { View } from 'react-native';

interface ReaderSegmentListProps {
  segments: DetailTextSegment[];
  fontSize: number;
  selectedSegmentId: string | null;
  onSegmentPress: (segment: DetailTextSegment) => void;
  maxSegments?: number;
}

function resolveDisplayNumber(segment: DetailTextSegment, index: number): number {
  if (segment.segment_number != null && segment.segment_number > 0) {
    return segment.segment_number;
  }
  return index + 1;
}

export function ReaderSegmentList({
  segments,
  fontSize,
  selectedSegmentId,
  onSegmentPress,
  maxSegments,
}: ReaderSegmentListProps) {
  const visible =
    maxSegments != null ? segments.slice(0, maxSegments) : segments;

  return (
    <View>
      {visible.map((segment, index) => (
        <ReaderSegmentBlock
          key={segment.segment_id}
          segment={segment}
          displayNumber={resolveDisplayNumber(segment, index)}
          fontSize={fontSize}
          selected={selectedSegmentId === segment.segment_id}
          onPress={() => onSegmentPress(segment)}
        />
      ))}
    </View>
  );
}
