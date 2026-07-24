import { MarkdownText } from '@/components/common/MarkdownText';
import { SeriesGroupRow } from '@/components/series/SeriesGroupRow';
import { useSeriesById } from '@/hooks/api/useSeries';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { pickSeriesMetadata } from '@/types/series';
import { imageUrl } from '@/utils/image-url';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SeriesInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: series, isLoading, error, refetch } = useSeriesById(id!);
  const language = useContentLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslate();

  const metadata = series ? pickSeriesMetadata(series.metadata, language) : undefined;
  const body = metadata?.description ?? '';

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#FDFDFC]" style={{ paddingTop: insets.top }}>
        <Pressable onPress={() => router.back()} className="p-4 active:opacity-70">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <ActivityIndicator style={{ marginTop: 48 }} />
      </View>
    );
  }

  if (error || !series) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FDFDFC]" style={{ paddingTop: insets.top }}>
        <Text className="text-destructive">{t('unableToLoad')}</Text>
        <Pressable onPress={() => refetch()} className="mt-3 active:opacity-70">
          <Text>{t('retry')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FDFDFC]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-2 py-1">
        <Pressable onPress={() => router.back()} className="p-2 active:opacity-70">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-2">
          <Image
            source={{ uri: imageUrl(series.image) }}
            style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 16 }}
            contentFit="cover"
          />
        </View>

        <View className="px-4 pt-4">
          <Text className="text-xl font-bold text-foreground">
            {metadata?.title}
          </Text>
        </View>

        {series.group ? <SeriesGroupRow group={series.group} /> : null}

        <View className="px-4 pt-6">
          {body ? (
            <MarkdownText content={body} />
          ) : (
            <Text className="text-center text-sm text-muted-foreground">
              {t('series_no_about', "No additional information available.")}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
