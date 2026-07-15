import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReaderVersionsPlaceholderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F8F4', paddingTop: insets.top }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }} accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            marginRight: 40,
          }}
        >
          {t('reader.version')}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ color: '#8a8a8a', textAlign: 'center', fontSize: 15 }}>
          {t('reader.coming_soon')}
        </Text>
      </View>
    </View>
  );
}
