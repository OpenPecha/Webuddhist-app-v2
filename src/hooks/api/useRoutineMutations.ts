import { QUERY_KEYS } from '@/constants/query-keys';
import {
  createRoutineWithTimeBlock,
  createTimeBlock,
  deleteTimeBlock,
  updateTimeBlock,
} from '@/services/routine';
import type { TimeBlockRequest } from '@/types/routine-mutations';
import { useTriggerNotificationSync } from '@/hooks/useTriggerNotificationSync';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRoutineMutations() {
  const queryClient = useQueryClient();
  const triggerSync = useTriggerNotificationSync();

  const afterRoutineChange = async (trigger: 'routineSaved' | 'blockDeleted') => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.routine.all });
    await triggerSync(trigger);
  };

  const createRoutine = useMutation({
    mutationFn: (request: TimeBlockRequest) => createRoutineWithTimeBlock(request),
    onSuccess: () => afterRoutineChange('routineSaved'),
  });

  const addTimeBlock = useMutation({
    mutationFn: ({ routineId, request }: { routineId: string; request: TimeBlockRequest }) =>
      createTimeBlock(routineId, request),
    onSuccess: () => afterRoutineChange('routineSaved'),
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
    onSuccess: () => afterRoutineChange('routineSaved'),
  });

  const removeTimeBlock = useMutation({
    mutationFn: ({ routineId, blockId }: { routineId: string; blockId: string }) =>
      deleteTimeBlock(routineId, blockId),
    onSuccess: () => afterRoutineChange('blockDeleted'),
  });

  return { createRoutine, addTimeBlock, saveTimeBlock, removeTimeBlock };
}
