import type { UserProfile } from '@/types/user';

export interface ProfileFormState {
  username: string;
  originalUsername: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatarUrl: string | null;
}

export function emptyProfileFormState(): ProfileFormState {
  return {
    username: '',
    originalUsername: '',
    firstName: '',
    lastName: '',
    bio: '',
    avatarUrl: null,
  };
}

export function profileToFormState(profile: UserProfile): ProfileFormState {
  return {
    username: profile.username ?? '',
    originalUsername: profile.username ?? '',
    firstName: profile.firstname ?? '',
    lastName: profile.lastname ?? '',
    bio: profile.about_me ?? '',
    avatarUrl: profile.avatar_url ?? null,
  };
}
