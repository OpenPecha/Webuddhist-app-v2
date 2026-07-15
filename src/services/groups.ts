import { NotFoundFailure } from '@/lib/api-error';
import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type {
  AuthorGroupSummary,
  GroupListResponse,
  PublicGroupDetail,
} from '@/types/groups';

export const DISCOVER_PAGE_SIZE = 20;
export const JOINED_GROUPS_FETCH_LIMIT = 50;

export async function fetchDiscoverGroups(
  language = 'en',
  skip = 0,
  limit = DISCOVER_PAGE_SIZE,
  search?: string,
): Promise<GroupListResponse> {
  const params: Record<string, string | number> = {
    language,
    group_type: 'COMMUNITY',
    skip,
    limit,
  };
  if (search?.trim()) params.search = search.trim();

  const { data } = await http.get<GroupListResponse>(ENDPOINTS.groups.list, { params });
  return data;
}

export async function fetchJoinedGroups(
  language = 'en',
  skip = 0,
  limit = JOINED_GROUPS_FETCH_LIMIT,
): Promise<GroupListResponse> {
  const { data } = await http.get<GroupListResponse>(ENDPOINTS.groups.joined, {
    params: { language, skip, limit },
  });
  return data;
}

export async function fetchGroupProfile(
  id: string,
  language = 'en',
): Promise<PublicGroupDetail> {
  const { data } = await http.get<PublicGroupDetail>(ENDPOINTS.groups.detail(id), {
    params: { language },
  });
  return data;
}

export async function joinGroup(id: string): Promise<void> {
  await http.post(ENDPOINTS.groups.join(id));
}

export async function leaveGroup(id: string): Promise<void> {
  await http.delete(ENDPOINTS.groups.join(id));
}

export async function followGroup(id: string): Promise<void> {
  await http.post(ENDPOINTS.groups.follow(id));
}

export async function unfollowGroup(id: string): Promise<void> {
  await http.delete(ENDPOINTS.groups.follow(id));
}

/**
 * Whether the current user has joined a community group.
 *
 * GET `/users/me/joined/author/groups?group_id=` returns 200 + group DTO when
 * joined; 404 when not joined (backend `get_joined_group`). Matches Flutter
 * `validateStatus: 200 || 404` and `statusCode == 200`.
 */
export async function checkGroupJoined(groupId: string): Promise<boolean> {
  try {
    await http.get(ENDPOINTS.groups.joined, {
      params: { group_id: groupId, skip: 0, limit: 1 },
    });
    return true;
  } catch (error) {
    if (error instanceof NotFoundFailure) return false;
    throw error;
  }
}

/**
 * Whether the current user follows a page group.
 *
 * GET `/users/me/following/author/groups?group_id=` returns 200 + group DTO when
 * following; 404 when not following (backend `get_followed_group`). Matches Flutter
 * `validateStatus: 200 || 404` and `statusCode == 200`.
 */
export async function checkGroupFollowed(groupId: string): Promise<boolean> {
  try {
    await http.get(ENDPOINTS.groups.following, {
      params: { group_id: groupId, skip: 0, limit: 1 },
    });
    return true;
  } catch (error) {
    if (error instanceof NotFoundFailure) return false;
    throw error;
  }
}

export function groupSummaryFromDetail(detail: PublicGroupDetail): AuthorGroupSummary {
  return detail;
}
