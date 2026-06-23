import {
  deleteUserAccumulator,
  fetchAccumulatorDetail,
} from '@/services/mala/accumulators';
import { malaSyncManager } from '@/services/mala/mala-sync-manager';
import { readLocalMalaState, recordMalaTap, writeLocalMalaState } from '@/lib/mala-storage';
import { resolveMalaUserId } from '@/lib/mala-user-id';
import {
  BEADS_PER_ROUND,
  beadInRound,
  malaRounds,
  type Mantra,
} from '@/types/mala';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import type { User } from 'react-native-auth0';

export interface MalaCounterState {
  total: number;
  beadInRound: number;
  rounds: number;
  accumulatorId: string | null;
  beadImageUrl?: string | null;
  isSeeding: boolean;
  seedFailed: boolean;
}

export interface IncrementBeadOptions {
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  onSound?: () => void;
}

const INITIAL: MalaCounterState = {
  total: 0,
  beadInRound: 0,
  rounds: 0,
  accumulatorId: null,
  isSeeding: true,
  seedFailed: false,
};

export function useMalaCounter(mantra: Mantra | null, authUser: User | undefined) {
  const [state, setState] = useState<MalaCounterState>(INITIAL);
  const userIdRef = useRef<string | null>(null);
  const presetId = mantra?.presetId ?? null;

  const seed = useCallback(async () => {
    if (!mantra || !presetId) return;

    setState((s) => ({ ...s, isSeeding: true, seedFailed: false }));

    const userId = await resolveMalaUserId(authUser);
    if (!userId) {
      setState((s) => ({ ...s, isSeeding: true, seedFailed: true }));
      return;
    }
    userIdRef.current = userId;

    const cached = await readLocalMalaState(userId, presetId);
    if (cached.beadImageUrl) {
      setState((s) => ({ ...s, beadImageUrl: cached.beadImageUrl }));
    }

    try {
      const detail = await fetchAccumulatorDetail(presetId);
      const serverTotal = detail?.total ?? 0;
      const serverAccId = detail?.accumulatorId ?? null;
      const total = Math.max(cached.total, serverTotal);
      const accumulatorId = serverAccId ?? cached.accumulatorId ?? null;

      await writeLocalMalaState(userId, presetId, {
        total,
        syncedTotal: serverTotal,
        accumulatorId,
        beadImageUrl: detail?.beadImageUrl ?? cached.beadImageUrl ?? null,
      });

      setState({
        total,
        beadInRound: beadInRound(total),
        rounds: malaRounds(total),
        accumulatorId,
        beadImageUrl: detail?.beadImageUrl ?? cached.beadImageUrl ?? mantra.beadImageUrl,
        isSeeding: false,
        seedFailed: false,
      });

      if (total > serverTotal) {
        void malaSyncManager.flush('launch');
      }
    } catch {
      setState((s) => ({ ...s, isSeeding: true, seedFailed: true }));
    }
  }, [authUser, mantra, presetId]);

  useEffect(() => {
    if (!mantra) return;
    setState(INITIAL);
    userIdRef.current = null;
    void seed();
  }, [mantra?.presetId, seed]);

  const incrementBead = useCallback(
    async ({ soundEnabled = true, vibrationEnabled = true, onSound }: IncrementBeadOptions = {}) => {
      if (!mantra || !presetId || state.isSeeding) return;

      const userId = userIdRef.current ?? (await resolveMalaUserId(authUser));
      if (!userId) return;
      userIdRef.current = userId;

      const newTotal = state.total + 1;
      const roundComplete = newTotal % BEADS_PER_ROUND === 0;

      await recordMalaTap(userId, presetId);
      setState((s) => ({
        ...s,
        total: newTotal,
        beadInRound: beadInRound(newTotal),
        rounds: malaRounds(newTotal),
      }));

      if (soundEnabled) onSound?.();
      if (vibrationEnabled) Vibration.vibrate(roundComplete ? 30 : 10);
      malaSyncManager.onTap(roundComplete);
    },
    [authUser, mantra, presetId, state.isSeeding, state.total],
  );

  const reset = useCallback(async () => {
    if (!mantra || !presetId) return;

    const userId = userIdRef.current ?? (await resolveMalaUserId(authUser));
    if (!userId) return;
    userIdRef.current = userId;

    const local = await readLocalMalaState(userId, presetId);
    const accId = local.accumulatorId ?? state.accumulatorId;

    if (accId) {
      try {
        await deleteUserAccumulator(accId);
      } catch {
        // Still clear local even if delete fails (offline).
      }
    }

    const beadImageUrl = local.beadImageUrl ?? state.beadImageUrl ?? mantra.beadImageUrl ?? null;
    await writeLocalMalaState(userId, presetId, {
      total: 0,
      syncedTotal: 0,
      accumulatorId: null,
      beadImageUrl,
    });

    setState({
      total: 0,
      beadInRound: 0,
      rounds: 0,
      accumulatorId: null,
      beadImageUrl,
      isSeeding: false,
      seedFailed: false,
    });
  }, [authUser, mantra, presetId, state.accumulatorId, state.beadImageUrl]);

  useEffect(() => {
    return () => {
      malaSyncManager.onScreenLeave();
    };
  }, [presetId]);

  return { state, seed, incrementBead, reset };
}
