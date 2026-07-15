import { useThemeColors } from '@/hooks/useThemeColors';
import { BEADS_PER_ROUND } from '@/types/mala';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

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
  const { foreground } = useThemeColors();
  const opacity = loaded ? 1 : 0.35;

  return (
    <View style={{ alignSelf: 'stretch', marginBottom: 16, minHeight: 88 }}>
      <Text
        style={{
          fontSize: 48,
          fontWeight: '700',
          fontFamily: 'Inter-Bold',
          color: foreground,
          opacity,
          fontVariant: ['tabular-nums'],
          minWidth: 160,
        }}
      >
        {beadInRound}/{beadsPerRound}
      </Text>
      <Text
        style={{
          marginTop: 4,
          fontSize: 20,
          fontFamily: 'Inter-Regular',
          color: foreground,
          opacity: loaded ? 0.7 : 0.35,
          fontVariant: ['tabular-nums'],
          minHeight: 28,
        }}
      >
        {t('mala.rounds', { count: rounds })}
      </Text>
    </View>
  );
}
