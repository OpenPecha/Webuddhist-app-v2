import { useUserPlanDay } from '@/hooks/api/usePlanTrack';
import type { PlanTextItem } from '@/types/plan-navigation';
import {
  buildPlanTextItems,
  resolvePlanReadingRouteForIndex,
  type PlanTaskForNavigation,
} from '@/utils/plan-subtask-navigation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useCallback } from 'react';

function mapDayTasksFromApi(
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
      audio_url: sub.audio_url,
      display_order: sub.display_order,
    })),
  }));
}

export function usePlanReadingSession() {
  const params = useLocalSearchParams<{
    planId: string;
    dayNumber: string;
    subTaskId?: string;
    taskIndex?: string;
    itemCount?: string;
    dayAudioUrl?: string;
    autoPlay?: string;
  }>();

  const router = useRouter();
  const planId = params.planId;
  const dayNumber = Number(params.dayNumber);
  const currentIndex = Number(params.taskIndex ?? 0);

  const { data: dayDetails, isLoading } = useUserPlanDay(planId, dayNumber);

  const tasks = useMemo(
    () => mapDayTasksFromApi(dayDetails?.tasks ?? []),
    [dayDetails],
  );

  const items: PlanTextItem[] = useMemo(() => buildPlanTextItems(tasks), [tasks]);

  const currentItem = items[currentIndex] ?? items[0];
  const dayAudioUrl = params.dayAudioUrl ?? dayDetails?.audio_url ?? null;

  const resolveAudioUrl = useCallback(
    (item: PlanTextItem | undefined) => item?.audioUrl ?? dayAudioUrl,
    [dayAudioUrl],
  );

  const navigateToIndex = useCallback(
    (index: number, autoPlay = false) => {
      const route = resolvePlanReadingRouteForIndex({
        planId,
        dayNumber,
        items,
        index,
        dayAudioUrl: dayAudioUrl ?? undefined,
        autoPlay,
      });
      if (!route) return;
      if (route.pathname === '/plan-text/[subtaskId]') {
        router.replace({
          pathname: '/plan-text/[subtaskId]',
          params: route.params as { subtaskId: string; planId: string; dayNumber: string },
        });
      } else {
        router.replace({
          pathname: '/reader/[textId]',
          params: route.params as { textId: string; planId: string; dayNumber: string },
        });
      }
    },
    [planId, dayNumber, items, dayAudioUrl, router],
  );

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) navigateToIndex(currentIndex - 1);
  }, [currentIndex, navigateToIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) navigateToIndex(currentIndex + 1);
  }, [currentIndex, items.length, navigateToIndex]);

  const handleFinish = useCallback(() => {
    router.back();
  }, [router]);

  return {
    isLoading,
    items,
    currentItem,
    currentIndex,
    dayAudioUrl,
    resolveAudioUrl,
    autoPlay: params.autoPlay === '1',
    canPrev: currentIndex > 0,
    canNext: currentIndex < items.length - 1,
    handlePrev,
    handleNext,
    handleFinish,
    tasks,
  };
}
