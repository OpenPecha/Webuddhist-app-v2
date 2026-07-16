import { dialogColors } from '@/components/ui/dialog-styles';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

interface MalaSeedErrorProps {
  message?: string;
  onRetry: () => void;
  compact?: boolean;
}

export function MalaSeedError({ message, onRetry, compact = false }: MalaSeedErrorProps) {
  const { t } = useTranslation();

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
      <Text className={`text-destructive ${compact ? 'text-left' : 'text-center'}`}>
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
        <Text className="text-[15px] text-foreground">{t('practice.retry')}</Text>
      </Pressable>
    </View>
  );
}
