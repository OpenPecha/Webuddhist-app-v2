import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

interface ReaderFontSizeButtonProps {
  onPress: () => void;
}

export function ReaderFontSizeButton({ onPress }: ReaderFontSizeButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      className="p-2 opacity-[0.85] active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={t('reader.font_size')}
    >
      <Text className="text-base font-semibold text-foreground">Aa</Text>
    </Pressable>
  );
}
