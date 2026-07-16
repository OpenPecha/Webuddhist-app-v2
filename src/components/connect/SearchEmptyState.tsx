import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { MagnifyingGlass } from 'phosphor-react-native';
import { View } from 'react-native';

interface SearchEmptyStateProps {
  variant: 'hint' | 'no_results';
  message: string;
}

export function SearchEmptyState({ variant, message }: SearchEmptyStateProps) {
  const { mutedForeground } = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 48,
      }}
    >
      {variant === 'hint' ? (
        <MagnifyingGlass size={64} color={mutedForeground} />
      ) : (
        <Ionicons name="search-outline" size={64} color={mutedForeground} />
      )}
      <Text className="mt-4 text-center text-base leading-[22px] text-muted-foreground">
        {message}
      </Text>
    </View>
  );
}
