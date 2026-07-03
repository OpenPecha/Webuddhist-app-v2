import { Text, View } from 'react-native';

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
        style={{
          fontSize: fontSize * SEGMENT_NUMBER_FONT_SCALE,
          fontWeight: '500',
          color: '#8a8a8a',
          textAlign: 'left',
        }}
      >
        {String(number).padStart(2, '0')}
      </Text>
    </View>
  );
}
