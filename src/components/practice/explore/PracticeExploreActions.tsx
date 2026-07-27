import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BookmarkSimple } from 'phosphor-react-native';
import { useTranslate } from '@tolgee/react';
import { Pressable, View } from 'react-native';

const FILLED_BACKGROUND = '#0C53C5';
const BORDER_LIGHT = '#DADADA';

interface PracticeExploreActionsProps {
  onMyPractices: () => void;
  onBookmarks: () => void;
}

/** "My practices" (filled) + "Bookmarks" (outlined) row from the Flutter practice explore screen. */
export function PracticeExploreActions({
  onMyPractices,
  onBookmarks,
}: PracticeExploreActionsProps) {
  const { t } = useTranslate();
  const { cardSurface, cardBorder, foreground, isDark } = useThemeColors();

  return (
    <View className="flex-row gap-3 px-4 pb-1 pt-4">
      <Pressable
        onPress={onMyPractices}
        className="h-11 flex-1 items-center justify-center rounded-xl active:opacity-85"
        style={{ backgroundColor: FILLED_BACKGROUND }}
        accessibilityRole="button"
      >
        <Text className="text-[14px] font-semibold text-white">{t('routine_title')}</Text>
      </Pressable>
      <Pressable
        onPress={onBookmarks}
        className="h-11 flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border active:opacity-85"
        style={{
          backgroundColor: cardSurface,
          borderColor: isDark ? cardBorder : BORDER_LIGHT,
        }}
        accessibilityRole="button"
      >
        <BookmarkSimple size={18} color={foreground} weight="regular" />
        <Text className="text-[14px] font-semibold text-foreground">{t('bookmarks')}</Text>
      </Pressable>
    </View>
  );
}
