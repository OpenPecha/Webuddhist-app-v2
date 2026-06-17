import type { RoutineItem } from '@/types/routine';

let pendingItem: RoutineItem | null = null;
let pendingBlockLocalId: string | null = null;

export function setPendingRoutineItem(blockLocalId: string, item: RoutineItem): void {
  pendingBlockLocalId = blockLocalId;
  pendingItem = item;
}

export function takePendingRoutineItem(
  blockLocalId: string,
): RoutineItem | null {
  if (pendingBlockLocalId !== blockLocalId || !pendingItem) return null;
  const item = pendingItem;
  pendingItem = null;
  pendingBlockLocalId = null;
  return item;
}
