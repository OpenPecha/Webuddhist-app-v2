import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BEADS_PER_ROUND } from '@/types/mala';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

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
    <View style={{ alignSelf: 'stretch', marginBottom: 16, minHeight: 88 }}>
      <Text
        className="min-w-40 font-bold tabular-nums text-foreground"
        style={{ fontSize: 48, opacity }}
      >
        {beadInRound}/{beadsPerRound}
      </Text>
      <Text
        className="mt-1 min-h-7 tabular-nums text-foreground"
        style={{ fontSize: 20, opacity: loaded ? 0.7 : 0.35 }}
      >
        {t('mala.rounds', { count: rounds })}
      </Text>
    </View>
  );
}
