import '@/lib/i18n';
import { MarkdownText } from '@/components/common/MarkdownText';
import { SeriesGroupRow } from '@/components/series/SeriesGroupRow';
import { useSeriesById } from '@/hooks/api/useSeries';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { pickSeriesMetadata } from '@/types/series';
import { imageUrl } from '@/utils/image-url';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SeriesInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: series, isLoading, error, refetch } = useSeriesById(id!);
  const language = useContentLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const metadata = series ? pickSeriesMetadata(series.metadata, language) : undefined;
  const body = metadata?.description ?? '';

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
        <Pressable onPress={() => router.back()} style={{ padding: 16 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <ActivityIndicator style={{ marginTop: 48 }} />
      </View>
    );
  }

  if (error || !series) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FDFDFC',
          paddingTop: insets.top,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#dc341e' }}>{t('series.load_error')}</Text>
        <Pressable onPress={() => refetch()} style={{ marginTop: 12 }}>
          <Text>{t('practice.retry')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Image
            source={{ uri: imageUrl(series.image) }}
            style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 16 }}
            contentFit="cover"
          />
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000' }}>
            {metadata?.title}
          </Text>
        </View>

        {series.group ? <SeriesGroupRow group={series.group} /> : null}

        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          {body ? (
            <MarkdownText content={body} />
          ) : (
            <Text style={{ fontSize: 14, color: '#8a8a8a', textAlign: 'center' }}>
              {t('series.no_about')}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
