import { StorageKeys, getString, setString } from '@/lib/storage';
import type { User } from 'react-native-auth0';

/** Mirrors Flutter `_resolveUserId` — persisted id first, then Auth0 sub. */
export async function resolveMalaUserId(authUser?: User | null): Promise<string | null> {
  const stored = await getString(StorageKeys.currentUserId);
  if (stored && stored.length > 0) return stored;

  const sub = authUser?.sub;
  if (sub && sub.length > 0) {
    await setString(StorageKeys.currentUserId, sub);
    return sub;
  }

  return null;
}
