import { useTextDetail } from '@/hooks/api/useTextDetail';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReaderScreen() {
  const { textId } = useLocalSearchParams<{ textId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, isLoading, error } = useTextDetail(textId);

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: '#000',
          }}
          numberOfLines={1}
        >
          {data?.title ?? t('reader.title')}
        </Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', color: '#8a8a8a' }}>
            {t('practice.routine_load_error')}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              fontFamily: 'Inter-Bold',
              color: '#000',
              marginBottom: 12,
            }}
          >
            {data?.title}
          </Text>
          {data?.description ? (
            <Text style={{ fontSize: 16, color: '#444', lineHeight: 24, marginBottom: 16 }}>
              {data.description}
            </Text>
          ) : null}
          <Text style={{ fontSize: 15, color: '#8a8a8a', lineHeight: 22 }}>
            {t('reader.placeholder')}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
