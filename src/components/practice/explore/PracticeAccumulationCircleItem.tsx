import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { normalizeBeadImageUrl } from '@/lib/mala-bead-image';
import { localizedMantraName, type Mantra } from '@/types/mala';
import { Image } from 'expo-image';
import { Flower } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';

export const ACCUMULATION_CIRCLE_ITEM_WIDTH = 110;

interface PracticeAccumulationCircleItemProps {
  mantra: Mantra;
  language: string;
  onPress: () => void;
  circleSize?: number;
  width?: number;
}

/** Circular bead + title used by the explore carousel and the all-accumulations grid. */
export function PracticeAccumulationCircleItem({
  mantra,
  language,
  onPress,
  circleSize = 70,
  width = ACCUMULATION_CIRCLE_ITEM_WIDTH,
}: PracticeAccumulationCircleItemProps) {
  const { mutedForeground, shortcutCard } = useThemeColors();
  const beadUrl = normalizeBeadImageUrl(
    mantra.mantra?.beadImageUrl ?? mantra.beadImageUrl,
  );
  const title = localizedMantraName(mantra, language);

  return (
    <Pressable
      onPress={onPress}
      className="items-center active:opacity-80"
      style={{ width }}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {beadUrl ? (
        <Image
          source={{ uri: beadUrl }}
          style={{ width: circleSize, height: circleSize, borderRadius: circleSize / 2 }}
          contentFit="cover"
          recyclingKey={mantra.presetId}
        />
      ) : (
        <View
          className="items-center justify-center"
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: shortcutCard,
          }}
        >
          <Flower size={24} color={mutedForeground} weight="regular" />
        </View>
      )}
      <Text
        className="mt-2 text-center text-[13px] font-bold leading-[17px] text-foreground"
        numberOfLines={2}
      >
        {title}
      </Text>
    </Pressable>
  );
}
