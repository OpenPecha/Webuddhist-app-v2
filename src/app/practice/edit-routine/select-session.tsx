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
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
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
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: '700',
            fontFamily: 'Inter-Bold',
            textAlign: 'center',
            color: '#000',
          }}
        >
          {t('editRoutine.add_session')}
        </Text>
        <View style={{ width: 38 }} />
      </View>

      {seriesLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={seriesList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#e8e8e4' }} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#8a8a8a', marginTop: 24 }}>
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
