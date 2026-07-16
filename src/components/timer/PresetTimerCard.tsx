import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { PresetTimer } from '@/types/timers';
import { Pressable, View } from 'react-native';

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
  const { cardSurface, cardBorder, isDark } = useThemeColors();
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
          className="text-foreground font-semibold"
          style={{ fontSize: 48, lineHeight: 48 }}
        >
          {displayMinutes(timer.durationMs)}
        </Text>
        <View style={{ height: 4 }} />
        <Text className="text-base text-foreground">{minLabel}</Text>
      </View>
    </Pressable>
  );
}
