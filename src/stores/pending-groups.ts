import type { AuthorGroupSummary } from '@/types/groups';

/**
 * In-memory optimistic join/follow state. Lost on JS bundle reload if an API
 * call is still in-flight — acceptable for v1; query invalidation reconciles
 * on success.
 *
 * TODO: persist pending ops across reload if product requires it.
 */
const pendingJoinedIds = new Set<string>();
const pendingFollowedIds = new Set<string>();
const pendingUnjoinedIds = new Set<string>();
const pendingJoinedGroups = new Map<string, AuthorGroupSummary>();
const listeners = new Set<() => void>();

let cachedSnapshot = {
  pendingJoinedIds: new Set<string>(),
  pendingFollowedIds: new Set<string>(),
  pendingUnjoinedIds: new Set<string>(),
  pendingJoinedGroups: [] as AuthorGroupSummary[],
};

export type PendingGroupsSnapshot = typeof cachedSnapshot;

function rebuildSnapshot() {
  cachedSnapshot = {
    pendingJoinedIds: new Set(pendingJoinedIds),
    pendingFollowedIds: new Set(pendingFollowedIds),
    pendingUnjoinedIds: new Set(pendingUnjoinedIds),
    pendingJoinedGroups: Array.from(pendingJoinedGroups.values()),
  };
}

function emit() {
  rebuildSnapshot();
  listeners.forEach((listener) => listener());
}

export function subscribePendingGroups(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPendingGroupsSnapshot() {
  return cachedSnapshot;
}

export function markGroupJoinedOptimistic(groupId: string, group?: AuthorGroupSummary) {
  pendingJoinedIds.add(groupId);
  pendingUnjoinedIds.delete(groupId);
  if (group) pendingJoinedGroups.set(groupId, group);
  emit();
}

export function markGroupFollowedOptimistic(groupId: string) {
  pendingFollowedIds.add(groupId);
  pendingJoinedIds.add(groupId);
  pendingUnjoinedIds.delete(groupId);
  emit();
}

export function markGroupUnjoinedOptimistic(groupId: string) {
  pendingUnjoinedIds.add(groupId);
  pendingJoinedIds.delete(groupId);
  pendingFollowedIds.delete(groupId);
  pendingJoinedGroups.delete(groupId);
  emit();
}

export function clearGroupPending(groupId: string) {
  pendingJoinedIds.delete(groupId);
  pendingFollowedIds.delete(groupId);
  pendingUnjoinedIds.delete(groupId);
  pendingJoinedGroups.delete(groupId);
  emit();
}

export function isGroupOptimisticallyJoined(
  groupId: string,
  apiJoined: boolean,
  snapshot: PendingGroupsSnapshot = getPendingGroupsSnapshot(),
) {
  if (snapshot.pendingUnjoinedIds.has(groupId)) return false;
  if (snapshot.pendingJoinedIds.has(groupId)) return true;
  return apiJoined;
}

export function isGroupOptimisticallyFollowed(
  groupId: string,
  apiFollowed: boolean,
  snapshot: PendingGroupsSnapshot = getPendingGroupsSnapshot(),
) {
  if (snapshot.pendingUnjoinedIds.has(groupId)) return false;
  if (snapshot.pendingFollowedIds.has(groupId)) return true;
  return apiFollowed;
}
