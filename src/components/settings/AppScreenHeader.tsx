import { ArrowLeft } from '@/constants/settings-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showBack?: boolean;
}

export function AppScreenHeader({
  title,
  onBack,
  rightAction,
  showBack = true,
}: AppScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const { foreground } = useThemeColors();

  return (
    <View className="bg-background" style={{ paddingTop: insets.top + 8 }}>
      <View className="min-h-12 flex-row items-center px-2 pb-2">
        {showBack ? (
          <Pressable
            onPress={onBack ?? (() => router.back())}
            className="h-10 w-10 items-center justify-center active:opacity-70"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color={foreground} />
          </Pressable>
        ) : (
          <View className="w-10" />
        )}
        <Text className="flex-1 text-center text-xl font-semibold">{title}</Text>
        <View className="min-w-10 items-end justify-center">{rightAction ?? <View className="w-10" />}</View>
      </View>
    </View>
  );
}
