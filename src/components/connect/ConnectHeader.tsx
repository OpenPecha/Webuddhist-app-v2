import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';
import { MagnifyingGlass } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';

export function ConnectHeader() {
  const router = useRouter();
  const { foreground } = useThemeColors();

  return (
    <View className="px-5 pb-2 pt-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[28px] font-bold text-foreground">{"Connect"}</Text>
          <Text className="mt-1 text-[15px] leading-[21px] text-muted-foreground">
            {"Find your groups and practice together"}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/connect/search')}
          className="p-2 active:opacity-75"
          accessibilityLabel={"Search groups"}
        >
          <MagnifyingGlass size={22} color={foreground} />
        </Pressable>
      </View>
    </View>
  );
}

export function ConnectSectionTitle({ label }: { label: string }) {
  return (
    <Text className="mb-2 px-5 text-lg font-bold text-foreground">{label}</Text>
  );
}
