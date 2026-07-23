import { Text } from '@/components/ui/text';
import { BEADS_PER_ROUND } from '@/types/mala';
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
  const opacity = loaded ? 1 : 0.35;

  return (
    <View className="self-stretch mb-4 min-h-[88px]">
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
        {rounds === 1 ? '1 round' : `${rounds} rounds`}
      </Text>
    </View>
  );
}
