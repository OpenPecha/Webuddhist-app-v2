import type { UserProfile } from '@/types/user';
import type { User } from 'react-native-auth0';

export function resolveProfileAvatarUrl(
  profile?: UserProfile | null,
  authUser?: User | null,
): string | null {
  return profile?.avatar_url || authUser?.picture || null;
}

export function resolveProfileDisplayName(
  profile?: UserProfile | null,
  authUser?: User | null,
): string {
  if (profile?.firstname?.trim()) return profile.firstname.trim();
  return authUser?.name?.trim() || profile?.username || '';
}

export function resolveProfileEmail(
  profile?: UserProfile | null,
  authUser?: User | null,
): string {
  return profile?.email || authUser?.email || '';
}
