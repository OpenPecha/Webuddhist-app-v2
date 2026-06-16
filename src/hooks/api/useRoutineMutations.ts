import { QUERY_KEYS } from '@/constants/query-keys';
import {
  createRoutineWithTimeBlock,
  createTimeBlock,
  deleteTimeBlock,
  updateTimeBlock,
} from '@/services/routine';
import type { TimeBlockRequest } from '@/types/routine-mutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRoutineMutations() {
  const queryClient = useQueryClient();

  const invalidateRoutine = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.routine.all });

  const createRoutine = useMutation({
    mutationFn: (request: TimeBlockRequest) => createRoutineWithTimeBlock(request),
    onSuccess: invalidateRoutine,
  });

  const addTimeBlock = useMutation({
    mutationFn: ({ routineId, request }: { routineId: string; request: TimeBlockRequest }) =>
      createTimeBlock(routineId, request),
    onSuccess: invalidateRoutine,
  });

  const saveTimeBlock = useMutation({
    mutationFn: ({
      routineId,
      blockId,
      request,
    }: {
      routineId: string;
      blockId: string;
      request: TimeBlockRequest;
    }) => updateTimeBlock(routineId, blockId, request),
    onSuccess: invalidateRoutine,
  });

  const removeTimeBlock = useMutation({
    mutationFn: ({ routineId, blockId }: { routineId: string; blockId: string }) =>
      deleteTimeBlock(routineId, blockId),
    onSuccess: invalidateRoutine,
  });

  return { createRoutine, addTimeBlock, saveTimeBlock, removeTimeBlock };
}
