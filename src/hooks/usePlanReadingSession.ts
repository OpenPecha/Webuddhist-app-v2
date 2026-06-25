import { QUERY_KEYS } from '@/constants/query-keys';
import type { PlanReadingNavigateDirection } from '@/constants/plan-reading';
import { useUserPlanDay } from '@/hooks/api/usePlanTrack';
import type { PlanTextItem } from '@/types/plan-navigation';
import { createPlanSubtaskCompletionSession } from '@/utils/plan-subtask-completion';
import {
  buildPlanTextItems,
  resolvePlanReadingRouteForIndex,
  type PlanTaskForNavigation,
} from '@/utils/plan-subtask-navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useCallback, useRef, useEffect } from 'react';

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

export function usePlanReadingSession(options?: { onBeforeNavigate?: () => void }) {
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
  const queryClient = useQueryClient();
  const planId = params.planId;
  const dayNumber = Number(params.dayNumber);
  const currentIndex = Number(params.taskIndex ?? 0);
  const isNavigatingRef = useRef(false);
  const onBeforeNavigateRef = useRef(options?.onBeforeNavigate);
  onBeforeNavigateRef.current = options?.onBeforeNavigate;

  const { data: dayDetails, isLoading } = useUserPlanDay(planId, dayNumber);

  const invalidatePlanDay = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.plans.userPlanDay(planId, dayNumber),
    });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.plans.completionStatus(planId),
    });
  }, [queryClient, planId, dayNumber]);

  const invalidateRef = useRef(invalidatePlanDay);
  invalidateRef.current = invalidatePlanDay;

  const completionSessionRef = useRef<ReturnType<typeof createPlanSubtaskCompletionSession> | null>(
    null,
  );
  if (!completionSessionRef.current) {
    completionSessionRef.current = createPlanSubtaskCompletionSession(() => {
      invalidateRef.current();
    });
  }

  useEffect(() => {
    isNavigatingRef.current = false;
  }, [params.taskIndex, params.subTaskId, params.planId]);

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

  const navigate = useCallback(
    async (direction: PlanReadingNavigateDirection) => {
      if (isNavigatingRef.current) return;

      onBeforeNavigateRef.current?.();

      const completion = completionSessionRef.current!;

      if (direction === 'prev') {
        if (currentIndex <= 0) return;
        isNavigatingRef.current = true;
        navigateToIndex(currentIndex - 1);
        return;
      }

      if (direction === 'next') {
        if (currentIndex >= items.length - 1) {
          isNavigatingRef.current = true;
          await completion.completeCurrentSubtask(currentItem);
          router.back();
          return;
        }
        isNavigatingRef.current = true;
        void completion.completeCurrentSubtask(currentItem);
        navigateToIndex(currentIndex + 1);
        return;
      }

      isNavigatingRef.current = true;
      await completion.completeCurrentSubtask(currentItem);
      router.back();
    },
    [currentIndex, currentItem, items.length, navigateToIndex, router],
  );

  const handlePrev = useCallback(() => {
    void navigate('prev');
  }, [navigate]);

  const handleNext = useCallback(() => {
    void navigate('next');
  }, [navigate]);

  const handleFinish = useCallback(() => {
    void navigate('finish');
  }, [navigate]);

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
    navigate,
    tasks,
  };
}
