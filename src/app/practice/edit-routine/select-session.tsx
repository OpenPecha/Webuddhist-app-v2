import { SessionListTile } from '@/components/practice/SessionListTile';
import { useSeries } from '@/hooks/api/useSeries';
import { setPendingRoutineItem } from '@/stores/edit-routine-selection';
import { pickSeriesMetadata } from '@/types/series';
import type { RoutineItem } from '@/types/routine';
import { imageUrl } from '@/utils/image-url';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SelectSessionScreen() {
  const { blockLocalId } = useLocalSearchParams<{ blockLocalId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const language = useContentLanguage();

  const { data: seriesData, isLoading: seriesLoading } = useSeries(0, 50);

  const onSelectSeries = (series: (typeof seriesList)[number]) => {
    const metaList = Array.isArray(series.metadata) ? series.metadata : [series.metadata];
    const meta = pickSeriesMetadata(metaList, language);
    const item: RoutineItem = {
      id: series.id,
      title: meta?.title ?? series.id,
      coverImage: series.image,
      type: 'series',
      language: meta?.language,
    };
    setPendingRoutineItem(blockLocalId, item);
    router.back();
  };

  const seriesList = seriesData?.series ?? [];

  return (
    <View className="flex-1 bg-[#FDFDFC]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-2 py-1">
        <Pressable onPress={() => router.back()} className="p-2 active:opacity-70">
          <Ionicons name="arrow-back" size={22} color="#000" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-bold text-foreground">
          {t('editRoutine.add_session')}
        </Text>
        <View className="w-[38px]" />
      </View>

      {seriesLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={seriesList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
          ItemSeparatorComponent={() => <View className="h-px bg-[#e8e8e4]" />}
          ListEmptyComponent={
            <Text className="mt-6 text-center text-muted-foreground">
              {t('editRoutine.no_series')}
            </Text>
          }
          renderItem={({ item }) => {
            const metaList = Array.isArray(item.metadata) ? item.metadata : [item.metadata];
            const meta = pickSeriesMetadata(metaList, language);
            return (
              <SessionListTile
                title={meta?.title ?? item.id}
                coverUri={imageUrl(item.image, 'thumbnail')}
                onPress={() => onSelectSeries(item)}
              />
            );
          }}
        />
      )}
    </View>
  );
}
