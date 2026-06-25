import { ConflictFailure } from '@/lib/api-error';
import { completeSubTask } from '@/services/plans';
import type { PlanTextItem } from '@/types/plan-navigation';

/** Flutter parity: container-scoped subtask completion for plan reading navigation. */
export function createPlanSubtaskCompletionSession(onSuccess: () => void) {
  const completedIds = new Set<string>();

  async function completeCurrentSubtask(item: PlanTextItem | undefined): Promise<void> {
    const subTaskId = item?.subTaskId;
    if (!subTaskId) return;
    if (item.isCompleted) return;
    if (completedIds.has(subTaskId)) return;

    completedIds.add(subTaskId);
    try {
      await completeSubTask(subTaskId);
      onSuccess();
    } catch (error) {
      if (error instanceof ConflictFailure) {
        onSuccess();
        return;
      }
      completedIds.delete(subTaskId);
    }
  }

  return { completeCurrentSubtask };
}
