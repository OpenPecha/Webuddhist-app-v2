import { QUERY_KEYS } from '@/constants/query-keys';
import {
  DISCOVER_PAGE_SIZE,
  fetchDiscoverGroups,
  fetchJoinedGroups,
  fetchGroupProfile,
  joinGroup,
  leaveGroup,
  followGroup,
  unfollowGroup,
  JOINED_GROUPS_FETCH_LIMIT,
} from '@/services/groups';
import type { AuthorGroupSummary } from '@/types/groups';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useAuthTokenReady } from '@/providers/auth-token';
import { useGuest } from '@/providers/guest';
import {
  clearGroupPending,
  markGroupFollowedOptimistic,
  markGroupJoinedOptimistic,
  markGroupUnjoinedOptimistic,
} from '@/stores/pending-groups';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from 'react-native-auth0';

export function useDiscoverGroups(search = '') {
  const language = useContentLanguage();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.groups.discover(language, search),
    queryFn: ({ pageParam = 0 }) =>
      fetchDiscoverGroups(language, pageParam, DISCOVER_PAGE_SIZE, search || undefined),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.skip + lastPage.limit;
      return next < lastPage.total ? next : undefined;
    },
  });
}

export function useJoinedGroups(skip = 0, limit = JOINED_GROUPS_FETCH_LIMIT) {
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const isAuthReady = useAuthTokenReady();

  return useQuery({
    queryKey: QUERY_KEYS.groups.joined(language, skip, limit),
    queryFn: () => fetchJoinedGroups(language, skip, limit),
    enabled: !!user && !isGuest && isAuthReady,
  });
}

export function useGroupProfile(groupId: string) {
  const language = useContentLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.groups.detail(groupId, language),
    queryFn: () => fetchGroupProfile(groupId, language),
    enabled: !!groupId,
  });
}

export function useJoinGroup(groupId: string, group?: AuthorGroupSummary) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => joinGroup(groupId),
    onMutate: () => {
      markGroupJoinedOptimistic(groupId, group);
    },
    onError: () => {
      clearGroupPending(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups.all });
    },
  });
}

export function useFollowGroup(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => followGroup(groupId),
    onMutate: () => {
      markGroupFollowedOptimistic(groupId);
    },
    onError: () => {
      clearGroupPending(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups.all });
    },
  });
}

export function useLeaveGroup(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => leaveGroup(groupId),
    onMutate: () => {
      markGroupUnjoinedOptimistic(groupId);
    },
    onError: () => {
      clearGroupPending(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups.all });
    },
  });
}

export function useUnfollowGroup(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unfollowGroup(groupId),
    onMutate: () => {
      markGroupUnjoinedOptimistic(groupId);
    },
    onError: () => {
      clearGroupPending(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups.all });
    },
  });
}
