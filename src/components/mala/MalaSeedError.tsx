import { dialogColors } from '@/components/ui/dialog-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

interface MalaSeedErrorProps {
  message?: string;
  onRetry: () => void;
  compact?: boolean;
}

export function MalaSeedError({ message, onRetry, compact = false }: MalaSeedErrorProps) {
  const { t } = useTranslation();
  const { destructive } = useThemeColors();

  return (
    <View
      style={{
        flex: compact ? undefined : 1,
        alignItems: compact ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: compact ? 0 : 24,
        gap: 12,
      }}
    >
      <Text
        style={{
          color: destructive,
          textAlign: compact ? 'left' : 'center',
          fontFamily: 'Inter-Regular',
        }}
      >
        {message ?? t('mala.load_error')}
      </Text>
      <Pressable
        onPress={onRetry}
        style={{
          borderRadius: 30,
          borderWidth: 1,
          borderColor: dialogColors.border,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: dialogColors.text, fontFamily: 'Inter-Regular', fontSize: 15 }}>
          {t('practice.retry')}
        </Text>
      </Pressable>
    </View>
  );
}
