import { useThemeColors } from '@/hooks/useThemeColors';
import type { PresetTimer } from '@/types/timers';
import { Pressable, Text, View } from 'react-native';

const CARD_BORDER_LIGHT = '#E4E4E4';

interface PresetTimerCardProps {
  timer: PresetTimer;
  minLabel: string;
  onPress: () => void;
}

export function displayMinutes(durationMs: number): number {
  return Math.floor(durationMs / 60000);
}

export function PresetTimerCard({ timer, minLabel, onPress }: PresetTimerCardProps) {
  const { foreground, cardSurface, cardBorder, isDark } = useThemeColors();
  const borderColor = isDark ? cardBorder : CARD_BORDER_LIGHT;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        aspectRatio: 1,
        borderRadius: 16,
        borderWidth: 1,
        borderColor,
        backgroundColor: cardSurface,
        opacity: pressed ? 0.9 : 1,
        overflow: 'hidden',
      })}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: 48,
            fontWeight: '600',
            lineHeight: 48,
            color: foreground,
            fontFamily: 'Inter-SemiBold',
          }}
        >
          {displayMinutes(timer.durationMs)}
        </Text>
        <View style={{ height: 4 }} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '400',
            lineHeight: 19,
            color: foreground,
            fontFamily: 'Inter-Regular',
          }}
        >
          {minLabel}
        </Text>
      </View>
    </Pressable>
  );
}
