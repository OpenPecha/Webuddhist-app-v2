import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { Pressable, View } from 'react-native';

interface MalaSeedErrorProps {
  message?: string;
  onRetry: () => void;
  compact?: boolean;
}

export function MalaSeedError({ message, onRetry, compact = false }: MalaSeedErrorProps) {

  return (
    <View
      className={cn(
        'gap-3',
        compact ? 'items-start' : 'flex-1 items-center justify-center p-6',
      )}
    >
      <Text className={`text-destructive ${compact ? 'text-left' : 'text-center'}`}>
        {message ?? "Could not load mala. Check your connection and try again."}
      </Text>
      <Pressable
        onPress={onRetry}
        className="rounded-[30px] border border-border px-5 py-2.5 active:opacity-80"
      >
        <Text className="text-[15px] text-foreground">{"Retry"}</Text>
      </Pressable>
    </View>
  );
}
