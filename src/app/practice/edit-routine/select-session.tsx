import { APP_ASSETS } from '@/constants/app-assets';
import { SessionListTile } from '@/components/practice/SessionListTile';
import { routineItemCoverUri } from '@/components/practice/RoutineItemCard';
import { useRecitations } from '@/hooks/api/useRecitations';
import { useSeries } from '@/hooks/api/useSeries';
import { useUserPlans } from '@/hooks/api/useUserPlans';
import { setPendingRoutineItem } from '@/stores/edit-routine-selection';
import { pickSeriesMetadata } from '@/types/series';
import type { UserPlan } from '@/types/plans';
import type { RoutineItem } from '@/types/routine';
import { imageUrl } from '@/utils/image-url';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabKey = 'plan' | 'series' | 'recitation';

export default function SelectSessionScreen() {
  const { blockLocalId } = useLocalSearchParams<{ blockLocalId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const language = useContentLanguage();
  const [tab, setTab] = useState<TabKey>('plan');

  const { data: plansData, isLoading: plansLoading } = useUserPlans();
  const { data: seriesData, isLoading: seriesLoading } = useSeries(0, 50);
  const { data: recitationsData, isLoading: recitationsLoading } = useRecitations();

  const onSelectPlan = (plan: UserPlan) => {
    const item: RoutineItem = {
      id: plan.id,
      title: plan.title,
      coverImage: plan.image,
      imageUrl: plan.image_url,
      type: 'plan',
      language: plan.language,
      enrolledAt: plan.started_at,
      startDate: plan.start_date,
    };
    setPendingRoutineItem(blockLocalId, item);
    router.back();
  };

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

  const onSelectRecitation = (recitation: { text_id: string; title: string }) => {
    const item: RoutineItem = {
      id: recitation.text_id,
      title: recitation.title,
      coverImage: null,
      type: 'recitation',
    };
    setPendingRoutineItem(blockLocalId, item);
    router.back();
  };

  const plans = plansData?.plans ?? [];
  const seriesList = seriesData?.series ?? [];
  const recitations = recitationsData?.recitations ?? [];
  const isLoading =
    tab === 'plan' ? plansLoading : tab === 'series' ? seriesLoading : recitationsLoading;

  const tabs: TabKey[] = ['plan', 'series', 'recitation'];

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

      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e8e8e4' }}>
        {tabs.map((key) => {
          const selected = tab === key;
          const label =
            key === 'plan'
              ? t('editRoutine.add_plan')
              : key === 'series'
                ? t('editRoutine.add_series')
                : t('editRoutine.add_recitation');
          return (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={{ flex: 1, paddingVertical: 14, alignItems: 'center' }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: selected ? '700' : '400',
                  fontFamily: selected ? 'Inter-Bold' : 'Inter-Regular',
                  color: selected ? '#000' : 'rgba(0,0,0,0.5)',
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : tab === 'plan' ? (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#e8e8e4' }} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#8a8a8a', marginTop: 24 }}>
              {t('editRoutine.no_plans')}
            </Text>
          }
          renderItem={({ item }) => (
            <SessionListTile
              title={item.title}
              coverUri={routineItemCoverUri(item.image, item.image_url)}
              onPress={() => onSelectPlan(item)}
            />
          )}
        />
      ) : tab === 'series' ? (
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
      ) : (
        <FlatList
          data={recitations}
          keyExtractor={(item) => item.text_id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#e8e8e4' }} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#8a8a8a', marginTop: 24 }}>
              {t('editRoutine.no_recitations')}
            </Text>
          }
          renderItem={({ item }) => (
            <SessionListTile
              title={item.title}
              coverUri={item.image_url ?? undefined}
              placeholderSource={APP_ASSETS.recitationCoverDefault}
              onPress={() => onSelectRecitation(item)}
            />
          )}
        />
      )}
    </View>
  );
}
