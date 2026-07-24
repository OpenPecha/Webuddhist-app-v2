import { Text } from '@/components/ui/text';
import { useTranslate } from '@tolgee/react';
import { Pressable } from 'react-native';

interface ReaderFontSizeButtonProps {
  onPress: () => void;
}

export function ReaderFontSizeButton({ onPress }: ReaderFontSizeButtonProps) {
  const { t } = useTranslate();

  return (
    <Pressable
      onPress={onPress}
      className="p-2 opacity-[0.85] active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={t('text_size')}
    >
      <Text className="text-base font-semibold text-foreground">Aa</Text>
    </Pressable>
  );
}
