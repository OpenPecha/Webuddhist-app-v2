import { StorageKeys, getString, setString } from '@/lib/storage';
import type { UserProfile } from '@/types/user';

function parseProfileJson(raw: string): UserProfile | null {
  try {
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    if (!parsed || typeof parsed !== 'object') return null;
    return normalizeUserProfile(parsed);
  } catch {
    return null;
  }
}

/** Ensures arrays and required strings exist after cache or API parse. */
export function normalizeUserProfile(data: Partial<UserProfile>): UserProfile {
  return {
    firstname: data.firstname ?? '',
    lastname: data.lastname ?? '',
    username: data.username ?? '',
    email: data.email ?? '',
    title: data.title ?? null,
    organization: data.organization ?? null,
    location: data.location ?? null,
    educations: data.educations ?? [],
    avatar_url: data.avatar_url ?? null,
    about_me: data.about_me ?? null,
    followers: data.followers ?? 0,
    following: data.following ?? 0,
    social_profiles: data.social_profiles ?? [],
  };
}

export async function loadCachedUserProfile(): Promise<UserProfile | null> {
  const profileRaw = await getString(StorageKeys.profileData);
  if (profileRaw) {
    const profile = parseProfileJson(profileRaw);
    if (profile) return profile;
  }

  const userRaw = await getString(StorageKeys.userData);
  if (userRaw) {
    return parseProfileJson(userRaw);
  }

  return null;
}

export async function saveCachedUserProfile(profile: UserProfile): Promise<void> {
  await setString(StorageKeys.profileData, JSON.stringify(profile));
  await setString(StorageKeys.lastProfileUpdate, new Date().toISOString());
}
