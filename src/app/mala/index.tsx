import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MalaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ padding: 8, width: 48, height: 48, justifyContent: 'center' }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: '700',
            fontFamily: 'Inter-Bold',
            textAlign: 'center',
          }}
        >
          Mala
        </Text>
        <View style={{ width: 48, height: 48 }} />
      </View>
    </View>
  );
}
