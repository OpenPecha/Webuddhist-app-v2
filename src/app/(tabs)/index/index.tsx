import '@/lib/i18n';
import { FeaturedPlanSection } from '@/components/home/FeaturedPlanSection';
import { HomeEventsSection } from '@/components/home/HomeEventsSection';
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
import { cn } from '@/utils/cn';
import { useGuest } from '@/providers/guest';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function HomeErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();

  return (
    <View className="items-center gap-3 px-6">
      <Text className="text-center text-destructive">
        {t('home.load_error')}
      </Text>
      <Pressable
        onPress={onRetry}
        className="rounded-lg bg-foreground px-4 py-2 active:opacity-70"
      >
        <Text className="text-[13px] font-medium text-white">
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
  const { isDark } = useThemeColors();
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

  return (
    <View className={cn('flex-1', isDark ? 'bg-black' : 'bg-[#FBF9F4]')} style={{ paddingTop: insets.top }}>
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
          <View className="flex-1" />
        ) : seriesError ? (
          <View className="min-h-80 flex-1 justify-center">
            <HomeErrorState onRetry={onRefresh} />
          </View>
        ) : seriesList.length === 0 ? (
          <View className="min-h-80 flex-1 justify-center">
            <Text className="px-6 text-center text-lg text-foreground">
              {t('home.no_feature_content')}
            </Text>
          </View>
        ) : showBody ? (
          <View>
            {verseLoading ? (
              <VerseOfDaySkeleton />
            ) : verse && !verseError ? (
              <VerseOfDayCard verse={verse} />
            ) : null}

            <View className="h-4" />
            <HomeShortcutsRow />
            <View className="h-4" />

            {routineInfoLoading && !isGuest ? (
              <MyPracticesStatsSkeleton />
            ) : showRoutineStats && routineInfo ? (
              <MyPracticesStatsCard
                routineInfo={routineInfo}
                onPress={() => router.replace('/practice')}
              />
            ) : null}

            {(showRoutineStats || (routineInfoLoading && !isGuest)) && (
              <View className="h-4" />
            )}

            <HomeEventsSection />
            <View className="h-4" />

            <FeaturedPlanSection />
            <HomeSharePrompt />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
