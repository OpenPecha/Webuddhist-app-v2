import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReaderSearchPlaceholderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F9F8F4]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-2 pb-2">
        <Pressable onPress={() => router.back()} className="p-2 active:opacity-70" accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text className="mr-10 flex-1 text-[17px] font-semibold text-foreground">
          {"Search"}
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-[15px] text-muted-foreground">
          {"Coming soon."}
        </Text>
      </View>
    </View>
  );
}
