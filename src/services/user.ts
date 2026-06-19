import { ENDPOINTS } from '@/lib/api-config';
import { ConflictFailure } from '@/lib/api-error';
import { normalizeUserProfile } from '@/lib/profile-cache';
import { http } from '@/lib/http';
import type {
  UserInfoUpdatePayload,
  UserProfile,
  UsernameUpdateResult,
} from '@/types/user';

export async function fetchUserProfile(): Promise<UserProfile> {
  const { data } = await http.get<Partial<UserProfile>>(ENDPOINTS.users.info);
  return normalizeUserProfile(data);
}

export async function updateUserProfile(payload: UserInfoUpdatePayload): Promise<void> {
  await http.post(ENDPOINTS.users.info, payload);
}

export async function deleteUserAccount(): Promise<void> {
  await http.delete(ENDPOINTS.users.info);
}

export async function updateUsername(username: string): Promise<UsernameUpdateResult> {
  try {
    const { data } = await http.patch<{ username?: string }>(ENDPOINTS.users.username, {
      username,
    });
    return { ok: true, username: data.username ?? username };
  } catch (error) {
    if (error instanceof ConflictFailure) {
      return { ok: false, suggestions: error.suggestions };
    }
    throw error;
  }
}

export async function uploadUserAvatar(uri: string, mimeType: string): Promise<string> {
  const formData = new FormData();
  const filename = uri.split('/').pop() ?? 'avatar.jpg';
  formData.append('file', {
    uri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);

  const { data } = await http.post<string>(ENDPOINTS.users.upload, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (typeof data === 'string') return data;
  return String(data);
}
