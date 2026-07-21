import { SegmentHtml } from '@/components/reader/SegmentHtml';
import { SegmentNumber } from '@/components/reader/SegmentNumber';
import type { DetailTextSegment } from '@/types/texts';
import { Pressable, View } from 'react-native';

interface ReaderSegmentBlockProps {
  segment: DetailTextSegment;
  displayNumber: number;
  fontSize: number;
  selected: boolean;
  onPress: () => void;
}

export function ReaderSegmentBlock({
  segment,
  displayNumber,
  fontSize,
  selected,
  onPress,
}: ReaderSegmentBlockProps) {
  const content = segment.content?.trim() ?? '';
  if (!content) return null;

  return (
    <Pressable onPress={onPress} className="mb-4">
      <View className="flex-row items-start">
        <SegmentNumber number={displayNumber} fontSize={fontSize} />
        <View className="flex-1">
          <SegmentHtml
            html={content}
            fontSize={fontSize}
            color="#000"
            fontFamily="Georgia"
            selected={selected}
          />
        </View>
      </View>
    </Pressable>
  );
}
