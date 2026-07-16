import { Text } from '@/components/ui/text';
import { View } from 'react-native';

const SEGMENT_NUMBER_WIDTH = 28;
const SEGMENT_NUMBER_FONT_SCALE = 0.6;

interface SegmentNumberProps {
  number: number;
  fontSize: number;
}

export function SegmentNumber({ number, fontSize }: SegmentNumberProps) {
  return (
    <View style={{ width: SEGMENT_NUMBER_WIDTH, paddingTop: 6 }}>
      <Text
        className="text-left font-medium text-muted-foreground"
        style={{ fontSize: fontSize * SEGMENT_NUMBER_FONT_SCALE }}
      >
        {String(number).padStart(2, '0')}
      </Text>
    </View>
  );
}
