import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

interface ReaderFontSizeButtonProps {
  onPress: () => void;
}

export function ReaderFontSizeButton({ onPress }: ReaderFontSizeButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      style={{ padding: 8, opacity: 0.85 }}
      accessibilityRole="button"
      accessibilityLabel={t('reader.font_size')}
    >
      <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>Aa</Text>
    </Pressable>
  );
}
