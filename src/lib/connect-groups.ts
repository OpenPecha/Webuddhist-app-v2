import type { AuthorGroupSummary, GroupMetadata } from '@/types/groups';

/** Exclude groups the user has already joined (API + optimistic). */
export function filterDiscoverGroups(
  discoverGroups: AuthorGroupSummary[],
  joinedGroupIds: Set<string>,
): AuthorGroupSummary[] {
  if (joinedGroupIds.size === 0) return discoverGroups;
  return discoverGroups.filter((group) => !joinedGroupIds.has(group.id));
}

/** Merge optimistically joined groups ahead of API my-groups list. */
export function mergeMyGroupsWithPending(
  apiGroups: AuthorGroupSummary[],
  pendingGroups: AuthorGroupSummary[],
  pendingUnjoinedIds: ReadonlySet<string>,
): AuthorGroupSummary[] {
  let merged: AuthorGroupSummary[];
  if (pendingGroups.length === 0) {
    merged = apiGroups;
  } else {
    const apiIds = new Set(apiGroups.map((g) => g.id));
    const pendingOnly = pendingGroups.filter((g) => !apiIds.has(g.id));
    merged = pendingOnly.length === 0 ? apiGroups : [...pendingOnly, ...apiGroups];
  }

  if (pendingUnjoinedIds.size === 0) return merged;
  return merged.filter((g) => !pendingUnjoinedIds.has(g.id));
}

/** Drop pending join/follow once API my-groups confirms membership. */
export function syncPendingGroupsWithApi(
  apiGroupIds: Set<string>,
  clearPending: (groupId: string) => void,
  pendingJoinedIds: ReadonlySet<string>,
  pendingFollowedIds: ReadonlySet<string>,
): void {
  for (const id of pendingJoinedIds) {
    if (apiGroupIds.has(id)) clearPending(id);
  }
  for (const id of pendingFollowedIds) {
    if (apiGroupIds.has(id)) clearPending(id);
  }
}

/** Drop pending unjoin once API my-groups no longer lists the group. */
export function syncPendingUnjoinWithApi(
  apiGroupIds: Set<string>,
  clearPending: (groupId: string) => void,
  pendingUnjoinedIds: ReadonlySet<string>,
): void {
  for (const id of pendingUnjoinedIds) {
    if (!apiGroupIds.has(id)) clearPending(id);
  }
}

export function formatCompactCount(count: number): string {
  if (count >= 1_000_000) {
    return `${trimTrailingZero((count / 1_000_000).toFixed(1))}M`;
  }
  if (count >= 1000) {
    return `${trimTrailingZero((count / 1000).toFixed(1))}k`;
  }
  return count.toLocaleString();
}

function trimTrailingZero(value: string): string {
  return value.endsWith('.0') ? value.slice(0, -2) : value;
}

export function firstGroupTag(group: AuthorGroupSummary): string | undefined {
  const tags = group.tags;
  if (!tags?.length) return undefined;
  const first = tags[0];
  return typeof first === 'string' ? first : first.name;
}

export function groupCardSubtitle(
  group: AuthorGroupSummary,
  meta: GroupMetadata | undefined,
  memberSingular: string,
  memberPlural: string,
): string {
  const typeLabel = firstGroupTag(group) ?? meta?.sub_title ?? group.group_type;
  const count = group.member_count ?? group.joiner_count ?? 0;
  const formatted = formatCompactCount(count);
  const memberLabel = count === 1 ? memberSingular : memberPlural;
  return `${typeLabel} · ${formatted} ${memberLabel}`;
}
