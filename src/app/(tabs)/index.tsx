import '@/lib/i18n';
import { CARD_SPACING } from '@/components/home/constants';
import { FeaturedPlanSection } from '@/components/home/FeaturedPlanSection';
import { HomeCalendarCard } from '@/components/home/HomeCalendarCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSharePrompt } from '@/components/home/HomeSharePrompt';
import { HomeShortcutsRow } from '@/components/home/HomeShortcutsRow';
import { MyPracticesStatsCard } from '@/components/home/MyPracticesStatsCard';
import { MyPracticesStatsSkeleton } from '@/components/home/MyPracticesStatsSkeleton';
import { VerseOfDayCard } from '@/components/home/VerseOfDayCard';
import { VerseOfDaySkeleton } from '@/components/home/VerseOfDaySkeleton';
import { useHomeRefresh } from '@/hooks/api/useHomeRefresh';
import { useRoutineInfo } from '@/hooks/api/useRoutineInfo';
import { useSeries } from '@/hooks/api/useSeries';
import { useVerseOfDay } from '@/hooks/api/useVerseOfDay';
import { useHomeBootstrap } from '@/hooks/useHomeBootstrap';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGuest } from '@/providers/guest';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function HomeErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  const { destructive, foreground } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', gap: 12, paddingHorizontal: 24 }}>
      <Text
        style={{
          color: destructive,
          textAlign: 'center',
          fontFamily: 'Inter-Regular',
        }}
      >
        {t('home.load_error')}
      </Text>
      <Pressable
        onPress={onRetry}
        style={{
          borderRadius: 8,
          backgroundColor: foreground,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '500' }}>
          {t('practice.retry')}
        </Text>
      </Pressable>
    </View>
  );
}

export default function Index() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const { isGuest } = useGuest();
  const { foreground, scaffoldBackground } = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);

  const { data: seriesData, isLoading: seriesLoading, isError: seriesError } = useSeries();
  const {
    data: verse,
    isLoading: verseLoading,
    isError: verseError,
  } = useVerseOfDay();
  const {
    data: routineInfo,
    isLoading: routineInfoLoading,
    isError: routineInfoError,
  } = useRoutineInfo();

  const refreshHome = useHomeRefresh();
  useHomeBootstrap();

  const seriesList = seriesData?.series ?? [];
  const showBody = !seriesLoading && !seriesError && seriesList.length > 0;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshHome();
    } finally {
      setRefreshing(false);
    }
  }, [refreshHome]);

  const showRoutineStats =
    !isGuest &&
    !routineInfoError &&
    routineInfo &&
    (routineInfo.seriesCount > 0 || routineInfo.recitationCount > 0);

  const topInset = Platform.OS === 'android' ? insets.top : 0;

  return (
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: topInset }}>
      <HomeHeader />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {seriesLoading && !seriesData ? (
          <View style={{ flex: 1 }} />
        ) : seriesError ? (
          <View style={{ flex: 1, justifyContent: 'center', minHeight: 320 }}>
            <HomeErrorState onRetry={onRefresh} />
          </View>
        ) : seriesList.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', minHeight: 320 }}>
            <Text
              style={{
                textAlign: 'center',
                paddingHorizontal: 24,
                fontSize: 18,
                color: foreground,
                fontFamily: 'Inter-Regular',
              }}
            >
              {t('home.no_feature_content')}
            </Text>
          </View>
        ) : showBody ? (
          <View>
            <HomeCalendarCard />
            <View style={{ height: CARD_SPACING }} />

            {verseLoading ? (
              <VerseOfDaySkeleton />
            ) : verse && !verseError ? (
              <VerseOfDayCard verse={verse} />
            ) : null}

            <View style={{ height: CARD_SPACING }} />
            <HomeShortcutsRow />
            <View style={{ height: CARD_SPACING }} />

            {routineInfoLoading && !isGuest ? (
              <MyPracticesStatsSkeleton />
            ) : showRoutineStats && routineInfo ? (
              <MyPracticesStatsCard
                routineInfo={routineInfo}
                onPress={() => router.replace('/practice')}
              />
            ) : null}

            {(showRoutineStats || (routineInfoLoading && !isGuest)) && (
              <View style={{ height: CARD_SPACING }} />
            )}

            <FeaturedPlanSection />
            <HomeSharePrompt />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
