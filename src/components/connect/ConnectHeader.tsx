import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

export function ConnectHeader() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000' }}>
            {t('nav.connect')}
          </Text>
          <Text style={{ fontSize: 14, color: '#8a8a8a', marginTop: 4, lineHeight: 20 }}>
            {t('connect.subtitle')}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/connect/search')}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#f0f0ec',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Ionicons name="search" size={20} color="#000" />
        </Pressable>
      </View>
    </View>
  );
}
