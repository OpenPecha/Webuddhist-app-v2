import { Text } from '@/components/ui/text';
import type { RecitationListItem } from '@/types/recitations';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

interface RecitationListTileProps {
  item: RecitationListItem;
  onPress: () => void;
}

export function RecitationListTile({ item, onPress }: RecitationListTileProps) {
  const { mutedForeground } = useThemeColors();
  const subtitle = item.first_segment?.content?.trim() ?? '';

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mb-2 overflow-hidden rounded-xl bg-card active:opacity-85"
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      <View className="flex-row items-stretch px-4 py-2.5">
        <View className="w-1 self-stretch rounded-sm bg-foreground/70" />
        <View className="ml-3 flex-1 justify-center">
          <Text
            className="text-[15px] font-bold text-foreground"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {subtitle ? (
            <Text
              className="mt-1 font-serif text-[13px] leading-[1.35] text-muted-foreground"
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View className="ml-2 justify-center">
          <View
            className="items-center justify-center rounded-full border border-border-input"
            style={{ width: 40, height: 40 }}
          >
            <Ionicons name="chevron-forward" size={16} color={mutedForeground} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
