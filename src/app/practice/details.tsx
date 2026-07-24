import { DayCompletionSheet } from "@/components/plans/DayCompletionSheet";
import { PlanDayCarousel } from "@/components/plans/PlanDayCarousel";
import { PlanDayHeader } from "@/components/plans/PlanDayHeader";
import { PlanDayVideosStrip } from "@/components/plans/PlanDayVideosStrip";
import { PlanHero } from "@/components/plans/PlanHero";
import { PlanTaskList } from "@/components/plans/PlanTaskList";
import { Text } from "@/components/ui/text";
import { useCompleteTask, useDeleteTask } from "@/hooks/api/useCompleteTask";
import { usePlanCompletionStatus } from "@/hooks/api/usePlanCompletionStatus";
import { usePlanDays } from "@/hooks/api/usePlanDays";
import { usePlanDetail } from "@/hooks/api/usePlanDetail";
import { useUserPlanDay } from "@/hooks/api/usePlanTrack";
import { useUserPlans } from "@/hooks/api/useUserPlans";
import type { UserPlan } from "@/types/plans";
import {
  buildPlanTextItems,
  isTaskNavigable,
  resolvePlanReadingRoute,
  type PlanTaskForNavigation,
} from "@/utils/plan-subtask-navigation";
import {
  buildDisabledDaysForCarousel,
  createPlanDateRange,
  getCurrentDay,
  getEffectiveStartDate,
  parseCalendarDate,
  resolveTrackUserPlan,
  resolveUserPlanForItem,
} from "@/utils/plan-utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function mapTasksFromDayDetails(
  rawTasks: {
    id: string;
    title: string;
    display_order: number;
    is_completed: boolean;
    sub_tasks: {
      id: string;
      content: string;
      is_completed: boolean;
      content_type: string;
      source_text_id?: string | null;
      segment_ids?: string[] | null;
      pecha_segment_id?: string | null;
      start_ms?: number | null;
      end_ms?: number | null;
      audio_url?: string | null;
      display_order: number | null;
    }[];
  }[],
): PlanTaskForNavigation[] {
  return rawTasks.map((task) => ({
    id: task.id,
    title: task.title,
    display_order: task.display_order,
    is_completed: task.is_completed,
    subtasks: task.sub_tasks.map((sub) => ({
      id: sub.id,
      content: sub.content,
      is_completed: sub.is_completed,
      content_type: sub.content_type,
      source_text_id: sub.source_text_id,
      segment_ids: sub.segment_ids ?? null,
      pecha_segment_id: sub.pecha_segment_id ?? null,
      start_ms: sub.start_ms ?? null,
      end_ms: sub.end_ms ?? null,
      audio_url: sub.audio_url,
      display_order: sub.display_order,
    })),
  }));
}

export default function PlanTrackScreen() {
  const params = useLocalSearchParams<{
    planId: string;
    selectedDay?: string;
    title?: string;
  }>();
  const planId = params.planId;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const hasSelectedDayParam = useMemo(() => {
    const parsed = Number(params.selectedDay);
    return Number.isFinite(parsed) && parsed > 0;
  }, [params.selectedDay]);

  const initialDay = useMemo(() => {
    const parsed = Number(params.selectedDay);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [params.selectedDay]);

  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [dayInitialized, setDayInitialized] = useState(hasSelectedDayParam);
  const [showDayComplete, setShowDayComplete] = useState(false);
  const [optimisticCompleted, setOptimisticCompleted] = useState<
    Record<string, boolean>
  >({});
  const prevDayCompletedRef = useRef<boolean | null>(null);

  const { data: userPlansData, isLoading: userPlansLoading } = useUserPlans();
  const { data: planDetail } = usePlanDetail(planId);
  const { data: daysData } = usePlanDays(planId);
  const { data: completionMap } = usePlanCompletionStatus(planId);
  const { data: dayDetails, isLoading: dayLoading } = useUserPlanDay(
    planId,
    selectedDay,
  );
  const completeTask = useCompleteTask(planId, selectedDay);
  const deleteTask = useDeleteTask(planId, selectedDay);
  const togglingTaskIdsRef = useRef<Set<string>>(new Set());

  const userPlan: UserPlan | null = useMemo(() => {
    const plans = userPlansData?.plans ?? [];
    if (!resolveUserPlanForItem(planId, plans)) return null;
    return resolveTrackUserPlan(planId, plans, planDetail);
  }, [planId, userPlansData?.plans, planDetail]);

  useEffect(() => {
    if (dayInitialized || !userPlan) return;
    setSelectedDay(getCurrentDay(userPlan));
    setDayInitialized(true);
  }, [userPlan, dayInitialized]);

  const totalDays =
    userPlan?.total_days ??
    planDetail?.total_days ??
    daysData?.days.length ??
    1;

  const title =
    params.title ??
    userPlan?.title ??
    planDetail?.title ??
    t("planTrack.title");

  const planStartDate = userPlan ? getEffectiveStartDate(userPlan) : new Date();

  const dateRange = userPlan ? createPlanDateRange(userPlan) : null;

  const carouselStartDate =
    parseCalendarDate(userPlan?.start_date ?? planDetail?.start_date ?? null) ??
    planStartDate;

  const carouselDays = useMemo(() => {
    if (daysData?.days.length) return daysData.days;
    return Array.from({ length: totalDays }, (_, i) => ({
      day_number: i + 1,
      id: `day-${i + 1}`,
    }));
  }, [daysData, totalDays]);

  const disabledDays = useMemo(
    () =>
      buildDisabledDaysForCarousel({
        totalDays,
        startDate: carouselStartDate,
        isTrackMode: true,
      }),
    [totalDays, carouselStartDate],
  );

  const navTasks = useMemo(
    () => mapTasksFromDayDetails(dayDetails?.tasks ?? []),
    [dayDetails],
  );

  const tasks = useMemo(
    () =>
      navTasks.map((task) => ({
        id: task.id,
        title: task.title,
        is_completed: task.is_completed,
        subtasks: task.subtasks,
      })),
    [navTasks],
  );

  const completedDays = useMemo(
    () => Object.values(completionMap ?? {}).filter(Boolean).length,
    [completionMap],
  );

  const dayAudioUrl = dayDetails?.audio_url ?? null;
  const planTextItems = useMemo(() => buildPlanTextItems(navTasks), [navTasks]);
  const hasNavigableContent = planTextItems.length > 0;
  const allTasksComplete =
    tasks.length > 0 && tasks.every((task) => task.is_completed);

  useEffect(() => {
    const isComplete = dayDetails?.is_completed === true;
    if (prevDayCompletedRef.current === null) {
      prevDayCompletedRef.current = isComplete;
      return;
    }
    if (!prevDayCompletedRef.current && isComplete) {
      setShowDayComplete(true);
    }
    prevDayCompletedRef.current = isComplete;
  }, [dayDetails?.is_completed]);

  useEffect(() => {
    prevDayCompletedRef.current = null;
    setOptimisticCompleted({});
    togglingTaskIdsRef.current.clear();
  }, [selectedDay]);

  // Once the server confirms a task's state matches our optimistic guess,
  // drop the override so future data changes aren't masked by stale state.
  // Mirrors the Flutter app's `_applyOptimisticState` reconciliation.
  useEffect(() => {
    const dayTasks = dayDetails?.tasks ?? [];
    if (dayTasks.length === 0) return;
    setOptimisticCompleted((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      let changed = false;
      const next = { ...prev };
      for (const task of dayTasks) {
        if (task.id in next && next[task.id] === task.is_completed) {
          delete next[task.id];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [dayDetails]);

  const openPlanReading = useCallback(
    (startAt: { taskId: string } | "first-incomplete", autoPlay = false) => {
      const route = resolvePlanReadingRoute({
        planId,
        dayNumber: selectedDay,
        tasks: navTasks,
        dayAudioUrl,
        startAt,
        autoPlay,
      });
      if (route) {
        if (route.pathname === "/plan-text/[subtaskId]") {
          router.push({
            pathname: "/plan-text/[subtaskId]",
            params: route.params as {
              subtaskId: string;
              planId: string;
              dayNumber: string;
            },
          });
        } else {
          router.push({
            pathname: "/reader/[textId]",
            params: route.params as {
              textId: string;
              planId: string;
              dayNumber: string;
            },
          });
        }
      }
    },
    [planId, selectedDay, navTasks, dayAudioUrl, router],
  );

  // Mirrors the Flutter app's `_handleTaskToggle`: checking a task calls
  // completeTask (POST .../complete), unchecking calls deleteTask
  // (DELETE .../task/{taskId}). Both apply an optimistic update up front and
  // revert it if the request fails; in-flight toggles for the same task are
  // ignored until the current request settles.
  const handleToggleTask = useCallback(
    (taskId: string, completed: boolean) => {
      if (togglingTaskIdsRef.current.has(taskId)) return;

      const newValue = !completed;
      togglingTaskIdsRef.current.add(taskId);
      setOptimisticCompleted((prev) => ({ ...prev, [taskId]: newValue }));

      const revert = () =>
        setOptimisticCompleted((prev) => {
          const next = { ...prev };
          delete next[taskId];
          return next;
        });
      const finish = () => {
        togglingTaskIdsRef.current.delete(taskId);
      };

      if (newValue) {
        completeTask.mutate(taskId, { onError: revert, onSettled: finish });
      } else {
        deleteTask.mutate(taskId, { onError: revert, onSettled: finish });
      }
    },
    [completeTask, deleteTask],
  );

  const showPracticeNow = hasNavigableContent;
  const isLoading = userPlansLoading || dayLoading;
  const notEnrolled = !userPlansLoading && !userPlan;

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center px-2 py-2"
        style={{ paddingTop: insets.top + 4 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 p-2 active:opacity-70"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text
          className="flex-1 text-center text-xl font-bold text-foreground"
          numberOfLines={1}
        >
          {title}
        </Text>
        <View className="w-10" />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : notEnrolled ? (
        <View className="flex-1 items-center justify-center gap-3 p-6">
          <Text className="text-center text-destructive">
            {t("practice.not_found")}
          </Text>
          <Pressable
            onPress={() =>
              router.replace({
                pathname: "/plans/[id]",
                params: { id: planId },
              })
            }
            className="p-3 active:opacity-70"
          >
            <Text className="font-semibold">{t("practice.retry")}</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: showPracticeNow ? 100 : 32 }}
        >
          <PlanHero
            variant="track"
            title={title}
            image={planDetail?.image ?? userPlan?.image}
            totalDays={totalDays}
            description={planDetail?.description ?? userPlan?.description}
          />
          {dateRange ? (
            <PlanDayHeader
              selectedDay={selectedDay}
              totalDays={totalDays}
              planId={planId}
              dateRange={dateRange}
              planStartDate={planStartDate}
              completionMap={completionMap}
              onMissedDaysPress={setSelectedDay}
            />
          ) : null}
          <PlanDayCarousel
            days={carouselDays}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            completionMap={completionMap}
            disabledDays={disabledDays}
            startDate={carouselStartDate}
          />
          <PlanDayVideosStrip videos={dayDetails?.videos ?? []} />
          <PlanTaskList
            tasks={tasks}
            readOnly={false}
            dayAudioUrl={dayAudioUrl}
            onToggleTask={handleToggleTask}
            optimisticCompleted={optimisticCompleted}
            onPressTask={(taskId) => {
              const task = navTasks.find((t) => t.id === taskId);
              if (task && isTaskNavigable(task)) {
                openPlanReading({ taskId }, false);
              }
            }}
            onPressTaskWithAudio={(taskId) => {
              const task = navTasks.find((t) => t.id === taskId);
              if (task && isTaskNavigable(task)) {
                openPlanReading({ taskId }, true);
              }
            }}
          />
        </ScrollView>
      )}

      {showPracticeNow && !notEnrolled && !isLoading ? (
        <View
          className="absolute bottom-0 left-0 right-0 bg-background px-4 pt-3"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Pressable
            onPress={() => openPlanReading("first-incomplete", false)}
            disabled={allTasksComplete}
            style={({ pressed }) => ({
              backgroundColor: "#000",
              borderRadius: 999,
              paddingVertical: 16,
              alignItems: "center",
              opacity: allTasksComplete ? 0.5 : pressed ? 0.75 : 1,
            })}
          >
            <Text className="text-base font-bold text-white">
              {t("planTrack.practice_now")}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <DayCompletionSheet
        visible={showDayComplete}
        onClose={() => setShowDayComplete(false)}
        dayNumber={selectedDay}
        totalDays={totalDays}
        completedDays={completedDays}
        planImage={planDetail?.image ?? userPlan?.image}
        thumbnailUrl={dayDetails?.thumbnail_url}
        shareableImageUrl={dayDetails?.shareable_image_url}
      />
    </View>
  );
}
