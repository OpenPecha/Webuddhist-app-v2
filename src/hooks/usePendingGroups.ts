import {
  getPendingGroupsSnapshot,
  subscribePendingGroups,
} from '@/stores/pending-groups';
import { useSyncExternalStore } from 'react';

export function usePendingGroups() {
  return useSyncExternalStore(subscribePendingGroups, getPendingGroupsSnapshot);
}
