import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { UsersThree } from 'phosphor-react-native';
import { View } from 'react-native';

export function DiscoverEmptyState() {
  const { mutedForeground } = useThemeColors();

  return (
    <View className="items-center px-8 py-8">
      <UsersThree size={48} color={mutedForeground} weight="duotone" />
      <Text className="mt-4 text-center text-base font-bold text-foreground">
        {"No groups yet"}
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-[22px] text-muted-foreground">
        {"Congratulations, you've joined all our groups! Check back soon. New ones are on the way"}
      </Text>
    </View>
  );
}
