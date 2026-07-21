import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

export function GroupProfileAppBar() {
  const router = useRouter();
  const { foreground } = useThemeColors();

  return (
    <View className="flex-row items-center px-2 py-1">
      <Pressable onPress={() => router.back()} className="p-2">
        <Ionicons name="chevron-back" size={24} color={foreground} />
      </Pressable>
    </View>
  );
}
