import { Text } from '@/components/ui/text';
import { BEADS_PER_ROUND } from '@/types/mala';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const COUNTER_FONT_SIZE = 48;
const COUNTER_LINE_HEIGHT = 56;
const ROUNDS_FONT_SIZE = 20;
const ROUNDS_LINE_HEIGHT = 28;

interface MalaCounterDisplayProps {
  beadInRound: number;
  rounds: number;
  beadsPerRound?: number;
  loaded?: boolean;
}

export function MalaCounterDisplay({
  beadInRound,
  rounds,
  beadsPerRound = BEADS_PER_ROUND,
  loaded = true,
}: MalaCounterDisplayProps) {
  const { t } = useTranslation();
  const opacity = loaded ? 1 : 0.35;

  return (
    <View className="mb-4 shrink-0 self-stretch">
      <Text
        className="min-w-40 font-bold tabular-nums text-foreground"
        style={{
          fontSize: COUNTER_FONT_SIZE,
          lineHeight: COUNTER_LINE_HEIGHT,
          opacity,
        }}
      >
        {beadInRound}/{beadsPerRound}
      </Text>
      <Text
        className="mt-1 tabular-nums text-foreground"
        style={{
          fontSize: ROUNDS_FONT_SIZE,
          lineHeight: ROUNDS_LINE_HEIGHT,
          opacity: loaded ? 0.7 : 0.35,
        }}
      >
        {t('mala.rounds', { count: rounds })}
      </Text>
    </View>
  );
}
