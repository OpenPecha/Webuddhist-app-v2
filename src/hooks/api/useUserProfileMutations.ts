import { QUERY_KEYS } from '@/constants/query-keys';
import {
  deleteUserAccount,
  updateUserProfile,
  updateUsername,
  uploadUserAvatar,
} from '@/services/user';
import type { UserInfoUpdatePayload } from '@/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUserProfileMutations() {
  const queryClient = useQueryClient();

  const invalidateProfile = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.all });

  const updateProfile = useMutation({
    mutationFn: (payload: UserInfoUpdatePayload) => updateUserProfile(payload),
    onSuccess: invalidateProfile,
  });

  const patchUsername = useMutation({
    mutationFn: (username: string) => updateUsername(username),
    onSuccess: (result) => {
      if (result.ok) invalidateProfile();
    },
  });

  const uploadAvatar = useMutation({
    mutationFn: ({ uri, mimeType }: { uri: string; mimeType: string }) =>
      uploadUserAvatar(uri, mimeType),
  });

  const deleteAccount = useMutation({
    mutationFn: () => deleteUserAccount(),
  });

  return { updateProfile, patchUsername, uploadAvatar, deleteAccount, invalidateProfile };
}
