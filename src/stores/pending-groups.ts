const pendingJoinedIds = new Set<string>();
const pendingUnjoinedIds = new Set<string>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribePendingGroups(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPendingGroupsSnapshot() {
  return {
    pendingJoinedIds: new Set(pendingJoinedIds),
    pendingUnjoinedIds: new Set(pendingUnjoinedIds),
  };
}

export function markGroupJoinedOptimistic(groupId: string) {
  pendingJoinedIds.add(groupId);
  pendingUnjoinedIds.delete(groupId);
  emit();
}

export function markGroupUnjoinedOptimistic(groupId: string) {
  pendingUnjoinedIds.add(groupId);
  pendingJoinedIds.delete(groupId);
  emit();
}

export function clearGroupPending(groupId: string) {
  pendingJoinedIds.delete(groupId);
  pendingUnjoinedIds.delete(groupId);
  emit();
}

export function isGroupOptimisticallyJoined(groupId: string, apiJoined: boolean) {
  if (pendingUnjoinedIds.has(groupId)) return false;
  if (pendingJoinedIds.has(groupId)) return true;
  return apiJoined;
}
