import { QUERY_KEYS } from '@/constants/query-keys';
import { completeSubTask, completeTask, deleteTask } from '@/services/plans';
import { ConflictFailure } from '@/lib/api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCompleteTask(planId: string, dayNumber: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.plans.userPlanDay(planId, dayNumber),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.plans.completionStatus(planId),
      });
    },
  });
}

/** Uncompletes ("unchecks") a task */
export function useDeleteTask(planId: string, dayNumber: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.plans.userPlanDay(planId, dayNumber),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.plans.completionStatus(planId),
      });
    },
  });
}

export function useCompleteSubTask(planId: string, dayNumber: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subTaskId: string) => {
      try {
        await completeSubTask(subTaskId);
      } catch (error) {
        if (error instanceof ConflictFailure) return;
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.plans.userPlanDay(planId, dayNumber),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.plans.completionStatus(planId),
      });
    },
  });
}
