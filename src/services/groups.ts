import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type {
  AuthorGroupSummary,
  GroupListResponse,
  PublicGroupDetail,
} from '@/types/groups';

export async function fetchDiscoverGroups(
  language = 'en',
  skip = 0,
  limit = 20,
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
  limit = 20,
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

export async function checkGroupJoined(groupId: string): Promise<boolean> {
  const { status } = await http.get(ENDPOINTS.groups.joined, {
    params: { group_id: groupId, skip: 0, limit: 1 },
    validateStatus: (code) => code === 200 || code === 404,
  });
  return status === 200;
}

export async function checkGroupFollowed(groupId: string): Promise<boolean> {
  const { status } = await http.get(ENDPOINTS.groups.following, {
    params: { group_id: groupId, skip: 0, limit: 1 },
    validateStatus: (code) => code === 200 || code === 404,
  });
  return status === 200;
}

export function groupSummaryFromDetail(detail: PublicGroupDetail): AuthorGroupSummary {
  return detail;
}
