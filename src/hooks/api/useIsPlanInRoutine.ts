import { useRoutine } from '@/hooks/api/useRoutine';
import type { RoutineData } from '@/types/routine';

export function isPlanInRoutine(
  planId: string,
  routine: RoutineData | null | undefined,
): boolean {
  return (
    routine?.blocks.some((block) =>
      block.items.some((item) => item.type === 'plan' && item.id === planId),
    ) ?? false
  );
}

export function isSeriesInRoutine(
  seriesId: string,
  routine: RoutineData | null | undefined,
): boolean {
  return (
    routine?.blocks.some((block) =>
      block.items.some((item) => item.type === 'series' && item.id === seriesId),
    ) ?? false
  );
}

export function useIsPlanInRoutine(planId: string) {
  const { data: routine, isLoading } = useRoutine();
  return {
    isInRoutine: isPlanInRoutine(planId, routine),
    isLoading,
    routine,
  };
}

export function useIsSeriesInRoutine(seriesId: string) {
  const { data: routine, isLoading } = useRoutine();
  return {
    isInRoutine: isSeriesInRoutine(seriesId, routine),
    isLoading,
    routine,
  };
}
