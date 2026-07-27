import { Text } from '@/components/ui/text';
import { displayMinutes, TIMER_CARD_BORDER_LIGHT } from '@/components/timer/PresetTimerCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { PresetTimer } from '@/types/timers';
import { Pressable, View } from 'react-native';

export const EXPLORE_TIMER_CARD_WIDTH = 150;
export const EXPLORE_TIMER_CARD_HEIGHT = 100;

interface PracticeExploreTimerCardProps {
  timer: PresetTimer;
  minLabel: string;
  onPress: () => void;
}

/** Wide timer card for the explore carousel (the grid screen uses the square PresetTimerCard). */
export function PracticeExploreTimerCard({
  timer,
  minLabel,
  onPress,
}: PracticeExploreTimerCardProps) {
  const { cardSurface, cardBorder, isDark } = useThemeColors();
  const borderColor = isDark ? cardBorder : TIMER_CARD_BORDER_LIGHT;

  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center overflow-hidden rounded-2xl border active:opacity-90"
      style={{
        width: EXPLORE_TIMER_CARD_WIDTH,
        height: EXPLORE_TIMER_CARD_HEIGHT,
        borderColor,
        backgroundColor: cardSurface,
      }}
      accessibilityRole="button"
    >
      <View className="items-center">
        <Text
          className="font-semibold text-foreground"
          style={{ fontSize: 28, lineHeight: 32 }}
        >
          {displayMinutes(timer.durationMs)}
        </Text>
        <Text className="mt-0.5 text-[14px] text-foreground">{minLabel}</Text>
      </View>
    </Pressable>
  );
}
