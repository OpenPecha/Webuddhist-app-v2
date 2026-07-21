import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
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
      className={cn(
        'gap-3',
        compact ? 'items-start' : 'flex-1 items-center justify-center p-6',
      )}
    >
      <Text className={`text-destructive ${compact ? 'text-left' : 'text-center'}`}>
        {message ?? t('mala.load_error')}
      </Text>
      <Pressable
        onPress={onRetry}
        className="rounded-[30px] border border-border px-5 py-2.5 active:opacity-80"
      >
        <Text className="text-[15px] text-foreground">{t('practice.retry')}</Text>
      </Pressable>
    </View>
  );
}
