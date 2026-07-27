import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { PracticeAccumulationCircleItem } from '@/components/practice/explore/PracticeAccumulationCircleItem';
import { PracticeExploreActions } from '@/components/practice/explore/PracticeExploreActions';
import { PracticeExploreTimerCard } from '@/components/practice/explore/PracticeExploreTimerCard';
import {
  PracticeAccumulationsSectionSkeleton,
  PracticeChantsSectionSkeleton,
  PracticePlansSectionSkeleton,
  PracticeTimersSectionSkeleton,
} from '@/components/practice/explore/PracticeExploreSkeletons';
import { PracticePlanCard } from '@/components/practice/explore/PracticePlanCard';
import { PracticeSectionContainer } from '@/components/practice/explore/PracticeSectionContainer';
import { RecitationListTile } from '@/components/recitation/RecitationListTile';
import { Text } from '@/components/ui/text';
import { useMalaPresets } from '@/hooks/api/useMalaPresets';
import { usePresetTimers } from '@/hooks/api/usePresetTimers';
import { useRecitations } from '@/hooks/api/useRecitations';
import { useSeries } from '@/hooks/api/useSeries';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useGuest } from '@/providers/guest';
import type { PresetTimer } from '@/types/timers';
import { sortPresetTimers } from '@/utils/timers';
import { type Href, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PLANS_PREVIEW = 2;
const CHANTS_PREVIEW = 2;
const ACCUMULATIONS_PREVIEW = 5;
const TIMERS_PREVIEW = 5;

export default function PracticeExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslate();
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const {
    visible: loginDrawerVisible,
    session: loginDrawerSession,
    showLoginDrawer,
    hideLoginDrawer,
  } = useLoginDrawer();
  const [refreshing, setRefreshing] = useState(false);

  const seriesQuery = useSeries(0, 10);
  const recitationsQuery = useRecitations();
  const accumulatorsQuery = useMalaPresets();
  const timersQuery = usePresetTimers();

  const series = seriesQuery.data?.series ?? [];
  const recitations = recitationsQuery.data?.recitations ?? [];
  const accumulators = accumulatorsQuery.data ?? [];
  const timers = useMemo(
    () => sortPresetTimers(timersQuery.data ?? []),
    [timersQuery.data],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        seriesQuery.refetch(),
        recitationsQuery.refetch(),
        accumulatorsQuery.refetch(),
        timersQuery.refetch(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [accumulatorsQuery, recitationsQuery, seriesQuery, timersQuery]);

  const requireAccount = useCallback(() => {
    if (isGuest || !user) {
      showLoginDrawer();
      return false;
    }
    return true;
  }, [isGuest, showLoginDrawer, user]);

  const openTimer = useCallback(
    (timer: PresetTimer) => {
      if (!requireAccount()) return;
      router.push({
        pathname: '/timers/active',
        params: {
          id: timer.id,
          durationMs: String(timer.durationMs),
          name: timer.name,
        },
      } as Href);
    },
    [requireAccount, router],
  );

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-3">
        <Text className="text-[22px] font-bold text-foreground">{t('nav_practice')}</Text>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {seriesQuery.isLoading ? (
          <PracticePlansSectionSkeleton />
        ) : series.length > 0 ? (
          <PracticeSectionContainer
            title={t('home_shortcut_plans')}
            onSeeAll={
              series.length >= PLANS_PREVIEW
                ? () => router.push('/practice/plans')
                : undefined
            }
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            >
              {series.slice(0, PLANS_PREVIEW).map((item) => (
                <PracticePlanCard
                  key={item.id}
                  series={item}
                  onPress={() => router.push(`/series/${item.id}`)}
                />
              ))}
            </ScrollView>
          </PracticeSectionContainer>
        ) : null}

        <PracticeExploreActions
          onMyPractices={() => router.push('/practice/my-practices')}
          onBookmarks={() => {
            if (!requireAccount()) return;
            router.push('/practice/bookmarks');
          }}
        />

        {recitationsQuery.isLoading ? (
          <PracticeChantsSectionSkeleton />
        ) : recitations.length > 0 ? (
          <PracticeSectionContainer
            title={t('home_chants')}
            onSeeAll={
              recitations.length > CHANTS_PREVIEW
                ? () => router.push('/practice/chants')
                : undefined
            }
          >
            {recitations.slice(0, CHANTS_PREVIEW).map((item) => (
              <RecitationListTile
                key={item.text_id}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: '/reader/[textId]',
                    params: { textId: item.text_id },
                  })
                }
              />
            ))}
          </PracticeSectionContainer>
        ) : null}

        {accumulatorsQuery.isLoading ? (
          <PracticeAccumulationsSectionSkeleton />
        ) : accumulators.length > 0 ? (
          <PracticeSectionContainer
            title={t('accumulations')}
            onSeeAll={
              accumulators.length >= ACCUMULATIONS_PREVIEW
                ? () => router.push('/practice/accumulations')
                : undefined
            }
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            >
              {accumulators.slice(0, ACCUMULATIONS_PREVIEW).map((mantra) => (
                <PracticeAccumulationCircleItem
                  key={mantra.presetId}
                  mantra={mantra}
                  language={language}
                  onPress={() => {
                    if (!requireAccount()) return;
                    router.push({
                      pathname: '/mala',
                      params: { initialPresetId: mantra.presetId },
                    });
                  }}
                />
              ))}
            </ScrollView>
          </PracticeSectionContainer>
        ) : null}

        {timersQuery.isLoading ? (
          <PracticeTimersSectionSkeleton />
        ) : timers.length > 0 ? (
          <PracticeSectionContainer
            title={t('meditation_timer')}
            onSeeAll={
              timers.length > TIMERS_PREVIEW
                ? () => router.push('/practice/timers')
                : undefined
            }
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            >
              {timers.slice(0, TIMERS_PREVIEW).map((timer) => (
                <PracticeExploreTimerCard
                  key={timer.id}
                  timer={timer}
                  minLabel={t('timer_min')}
                  onPress={() => openTimer(timer)}
                />
              ))}
            </ScrollView>
          </PracticeSectionContainer>
        ) : null}
      </ScrollView>

      <LoginDrawer
        key={loginDrawerSession}
        visible={loginDrawerVisible}
        onClose={hideLoginDrawer}
      />
    </View>
  );
}
