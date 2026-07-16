import { PlanDayCarousel } from '@/components/plans/PlanDayCarousel';
import { PlanHero } from '@/components/plans/PlanHero';
import { PlanTaskList } from '@/components/plans/PlanTaskList';
import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { useIsPlanEnrolled } from '@/hooks/api/useIsPlanEnrolled';
import { useUserPlans } from '@/hooks/api/useUserPlans';
import { useIsPlanInRoutine, useIsSeriesInRoutine } from '@/hooks/api/useIsPlanInRoutine';
import { usePlanDays } from '@/hooks/api/usePlanDays';
import { usePlanDetail } from '@/hooks/api/usePlanDetail';
import { usePublicPlanDay } from '@/hooks/api/usePublicPlanDay';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import {
  buildDisabledDaysForCarousel,
  getCurrentDay,
  defaultPreviewSelectedDay,
  FIRST_PLAN_PREVIEW_DAY_COUNT,
  isFutureFixedDatePlan,
  parseCalendarDate,
  resolveUserPlanForItem,
} from '@/utils/plan-utils';
import {
  isTaskNavigable,
  mapPublicPlanTasksToNavigation,
  resolvePlanReadingRoute,
} from '@/utils/plan-subtask-navigation';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth0 } from 'react-native-auth0';

export default function PlanPreviewScreen() {
  const { id, seriesId } = useLocalSearchParams<{ id: string; seriesId?: string }>();
  const planId = id!;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();

  const { data: plan, isLoading: planLoading, error: planError, refetch } = usePlanDetail(planId);
  const { data: daysData, isLoading: daysLoading } = usePlanDays(planId);
  const { data: isEnrolled, isLoading: enrolledLoading } = useIsPlanEnrolled(planId);
  const { data: userPlansData, isLoading: userPlansLoading } = useUserPlans();
  const { isInRoutine: isPlanInRoutine, isLoading: routineLoading } = useIsPlanInRoutine(planId);
  const { isInRoutine: isSeriesInRoutine } = useIsSeriesInRoutine(seriesId ?? '');

  const days = daysData?.days ?? [];
  const [selectedDay, setSelectedDay] = useState(1);
  const [dayInitialized, setDayInitialized] = useState(false);

  useEffect(() => {
    if (!plan || dayInitialized) return;
    setSelectedDay(defaultPreviewSelectedDay(plan.start_date, plan.total_days));
    setDayInitialized(true);
  }, [plan, dayInitialized]);

  useEffect(() => {
    if (days.length && !days.some((d) => d.day_number === selectedDay)) {
      setSelectedDay(days[0].day_number);
    }
  }, [days, selectedDay]);

  const { data: dayDetail, isLoading: dayLoading } = usePublicPlanDay(planId, selectedDay);

  const signedIn = !!user && !isGuest && isAuthReady;
  const awaitingEnrollmentCheck = signedIn && enrolledLoading;
  const redirectingToTrack = signedIn && !enrolledLoading && isEnrolled === true;

  useEffect(() => {
    if (!signedIn || enrolledLoading || !dayInitialized || !plan) return;
    if (isEnrolled && userPlansLoading) return;
    if (isEnrolled) {
      const userPlan = resolveUserPlanForItem(planId, userPlansData?.plans ?? []);
      const redirectDay =
        (userPlan ? getCurrentDay(userPlan) : undefined) ?? selectedDay;
      router.replace({
        pathname: '/practice/details',
        params: {
          planId,
          title: plan.title,
          selectedDay: String(redirectDay),
        },
      });
    }
  }, [
    signedIn,
    isEnrolled,
    enrolledLoading,
    dayInitialized,
    userPlansLoading,
    plan,
    planId,
    router,
    selectedDay,
    userPlansData?.plans,
  ]);

  const planStartDate = parseCalendarDate(plan?.start_date ?? null);
  const isFirstPlanInSeries = !!seriesId;
  const disabledDays = useMemo(
    () =>
      buildDisabledDaysForCarousel({
        totalDays: plan?.total_days ?? days.length,
        startDate: planStartDate,
        previewUnlockDayCount: isFirstPlanInSeries ? FIRST_PLAN_PREVIEW_DAY_COUNT : undefined,
      }),
    [plan?.total_days, days.length, planStartDate, isFirstPlanInSeries],
  );

  const hideAddToRoutine =
    isFutureFixedDatePlan(plan?.start_date) ||
    isPlanInRoutine ||
    (!!seriesId && isSeriesInRoutine);

  const showStickyCta = !hideAddToRoutine && !isEnrolled;
  const isLoading =
    planLoading ||
    daysLoading ||
    !dayInitialized ||
    routineLoading ||
    awaitingEnrollmentCheck ||
    redirectingToTrack;

  const handleAddToRoutine = () => {
    if (isGuest || !user) {
      showLoginDrawer();
      return;
    }
    router.push({
      pathname: '/practice/edit-routine',
      params: { initialPlanId: planId },
    });
  };

  const navTasks = useMemo(
    () => mapPublicPlanTasksToNavigation(dayDetail?.tasks ?? []),
    [dayDetail],
  );

  const tasks = useMemo(
    () =>
      navTasks.map((task) => ({
        id: task.id,
        title: task.title,
        subtasks: task.subtasks,
      })),
    [navTasks],
  );

  const dayAudioUrl = dayDetail?.audio_url ?? null;

  const openPlanReading = useCallback(
    (startAt: { taskId: string } | 'first-incomplete', autoPlay = false) => {
      const route = resolvePlanReadingRoute({
        planId,
        dayNumber: selectedDay,
        tasks: navTasks,
        dayAudioUrl,
        startAt,
        autoPlay,
        preview: true,
      });
      if (!route) return;
      if (route.pathname === '/plan-text/[subtaskId]') {
        router.push({
          pathname: '/plan-text/[subtaskId]',
          params: route.params as { subtaskId: string; planId: string; dayNumber: string },
        });
      } else {
        router.push({
          pathname: '/reader/[textId]',
          params: route.params as { textId: string; planId: string; dayNumber: string },
        });
      }
    },
    [planId, selectedDay, navTasks, dayAudioUrl, router],
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <ActivityIndicator style={{ marginTop: 48 }} />
      </View>
    );
  }

  if (planError || !plan) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Text className="text-destructive">{t('practice.not_found')}</Text>
          <Pressable onPress={() => refetch()}>
            <Text>{t('practice.retry')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC' }}>
      <View
        style={{
          paddingTop: insets.top + 4,
          paddingHorizontal: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text
          className="mr-10 flex-1 text-[17px] font-semibold text-foreground"
          numberOfLines={1}
        >
          {plan.title}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: showStickyCta ? 100 : 32 }}
        showsVerticalScrollIndicator={false}
      >
        <PlanHero title={plan.title} image={plan.image} totalDays={plan.total_days} description={plan.description} />
        {days.length > 0 ? (
          <PlanDayCarousel
            days={days}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            disabledDays={disabledDays}
            startDate={planStartDate}
          />
        ) : null}
        {dayLoading ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : (
          <PlanTaskList
            tasks={tasks}
            readOnly
            dayAudioUrl={dayAudioUrl}
            onPressTask={(taskId) => {
              const task = navTasks.find((item) => item.id === taskId);
              if (task && isTaskNavigable(task)) {
                openPlanReading({ taskId }, false);
              }
            }}
            onPressTaskWithAudio={(taskId) => {
              const task = navTasks.find((item) => item.id === taskId);
              if (task && isTaskNavigable(task)) {
                openPlanReading({ taskId }, true);
              }
            }}
          />
        )}
      </ScrollView>

      {showStickyCta ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FDFDFC',
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: insets.bottom + 16,
            borderTopWidth: 1,
            borderTopColor: '#e8e8e4',
          }}
        >
          <Pressable
            onPress={handleAddToRoutine}
            style={({ pressed }) => ({
              backgroundColor: '#000',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Text className="text-base font-semibold text-white">
              {t('plans.preview.add_to_routine')}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </View>
  );
}
