import {
  createUserAccumulator,
  updateUserAccumulator,
} from '@/services/mala/accumulators';
import {
  listDirtyMalaPresetIds,
  readLocalMalaState,
  writeLocalMalaState,
} from '@/lib/mala-storage';
import { resolveMalaUserId } from '@/lib/mala-user-id';

export type MalaSyncReason =
  | 'launch'
  | 'tap'
  | 'roundComplete'
  | 'debounce'
  | 'background'
  | 'screenLeave';

const DEBOUNCE_MS = 5000;
const MAX_BACKOFF_MS = 60_000;

type IsLoggedIn = () => boolean;

class MalaSyncManager {
  private started = false;
  private isSyncing = false;
  private dirty = false;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryAttempt = 0;
  private isLoggedIn: IsLoggedIn = () => false;

  configure(isLoggedIn: IsLoggedIn) {
    this.isLoggedIn = isLoggedIn;
  }

  start() {
    if (this.started) return;
    this.started = true;
    void this.flush('launch');
  }

  stop() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.debounceTimer = null;
    this.retryTimer = null;
    this.started = false;
  }

  onTap(roundComplete: boolean) {
    if (roundComplete) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      void this.flush('roundComplete');
    } else {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => void this.flush('debounce'), DEBOUNCE_MS);
    }
  }

  onBackground() {
    void this.flush('background');
  }

  onScreenLeave() {
    void this.flush('screenLeave');
  }

  async flush(_reason: MalaSyncReason): Promise<void> {
    if (!this.isLoggedIn()) return;

    const userId = await resolveMalaUserId();
    if (!userId) return;

    if (this.isSyncing) {
      this.dirty = true;
      return;
    }

    this.isSyncing = true;
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    try {
      for (const presetId of await listDirtyMalaPresetIds(userId)) {
        const state = await readLocalMalaState(userId, presetId);
        if (state.total <= state.syncedTotal) continue;

        let accumulatorId = state.accumulatorId;
        if (!accumulatorId) {
          const created = await createUserAccumulator(presetId);
          accumulatorId = created.accumulatorId ?? null;
          if (!accumulatorId) throw new Error('Create returned no accumulator id');
          await writeLocalMalaState(userId, presetId, {
            ...state,
            accumulatorId,
          });
        }

        const sending = state.total;
        const updated = await updateUserAccumulator(accumulatorId, sending);
        const after = await readLocalMalaState(userId, presetId);
        await writeLocalMalaState(userId, presetId, {
          ...after,
          total: Math.max(after.total, updated.total),
          syncedTotal: Math.max(updated.total, sending),
          accumulatorId: updated.accumulatorId ?? accumulatorId,
        });
      }

      this.retryAttempt = 0;
      if (this.retryTimer) {
        clearTimeout(this.retryTimer);
        this.retryTimer = null;
      }
    } catch {
      this.scheduleRetry();
    } finally {
      this.isSyncing = false;
      if (this.dirty) {
        this.dirty = false;
        void this.flush(_reason);
      }
    }
  }

  private scheduleRetry() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    const seconds = Math.min(MAX_BACKOFF_MS / 1000, 2 ** (this.retryAttempt + 1));
    this.retryAttempt += 1;
    this.retryTimer = setTimeout(() => void this.flush('launch'), seconds * 1000);
  }
}

export const malaSyncManager = new MalaSyncManager();
