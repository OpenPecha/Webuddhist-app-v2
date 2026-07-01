import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

export function GroupProfileAppBar() {
  const router = useRouter();
  const { foreground } = useThemeColors();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 }}>
      <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
        <Ionicons name="chevron-back" size={24} color={foreground} />
      </Pressable>
    </View>
  );
}
