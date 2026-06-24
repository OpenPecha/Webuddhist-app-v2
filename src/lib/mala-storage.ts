import { emptyLocalMalaState, isMalaDirty, type LocalMalaState } from '@/types/mala';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = 'mala_counts:';

function storageKey(userId: string, presetId: string): string {
  return `${KEY_PREFIX}${userId}:${presetId}`;
}

function parseState(raw: string | null): LocalMalaState {
  if (!raw) return emptyLocalMalaState();
  try {
    const parsed = JSON.parse(raw) as Partial<LocalMalaState>;
    return {
      total: parsed.total ?? 0,
      syncedTotal: parsed.syncedTotal ?? 0,
      accumulatorId: parsed.accumulatorId ?? null,
      beadImageUrl: parsed.beadImageUrl ?? null,
    };
  } catch {
    return emptyLocalMalaState();
  }
}

export async function readLocalMalaState(
  userId: string,
  presetId: string,
): Promise<LocalMalaState> {
  const raw = await AsyncStorage.getItem(storageKey(userId, presetId));
  return parseState(raw);
}

export async function writeLocalMalaState(
  userId: string,
  presetId: string,
  state: LocalMalaState,
): Promise<void> {
  await AsyncStorage.setItem(storageKey(userId, presetId), JSON.stringify(state));
}

export async function recordMalaTap(userId: string, presetId: string): Promise<LocalMalaState> {
  const current = await readLocalMalaState(userId, presetId);
  const next = { ...current, total: current.total + 1 };
  await writeLocalMalaState(userId, presetId, next);
  return next;
}

export async function listDirtyMalaPresetIds(userId: string): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  const prefix = `${KEY_PREFIX}${userId}:`;
  const dirty: string[] = [];

  for (const key of keys) {
    if (!key.startsWith(prefix)) continue;
    const raw = await AsyncStorage.getItem(key);
    if (isMalaDirty(parseState(raw))) {
      dirty.push(key.slice(prefix.length));
    }
  }

  return dirty;
}
