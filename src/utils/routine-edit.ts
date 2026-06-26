import type { RoutineItem } from '@/types/routine';
import type { SessionRequest, TimeBlockRequest } from '@/types/routine-mutations';
import { formatRoutineTimeFromInt } from '@/utils/routine-time';

export interface EditableRoutineBlock {
  localId: string;
  apiTimeBlockId?: string;
  timeInt: number;
  formattedTime: string;
  notificationEnabled: boolean;
  items: RoutineItem[];
}

export function timeIntFromParts(hour24: number, minute: number): number {
  return hour24 * 100 + minute;
}

export function partsFromTimeInt(timeInt: number): { hour24: number; minute: number } {
  return {
    hour24: Math.floor(timeInt / 100),
    minute: timeInt % 100,
  };
}

export function timeStringFromInt(timeInt: number): string {
  const { hour24, minute } = partsFromTimeInt(timeInt);
  return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

export function createEmptyBlock(timeInt = defaultBlockTimeInt()): EditableRoutineBlock {
  return {
    localId: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timeInt,
    formattedTime: formatRoutineTimeFromInt(timeInt),
    notificationEnabled: true,
    items: [],
  };
}

export function defaultBlockTimeInt(): number {
  const now = new Date();
  return timeIntFromParts(now.getHours(), now.getMinutes());
}

function routineItemToSession(item: RoutineItem, displayOrder: number): SessionRequest {
  const session_type =
    item.type === 'plan' ? 'PLAN' : item.type === 'series' ? 'SERIES' : 'RECITATION';
  return {
    session_type,
    source_id: item.id,
    display_order: displayOrder,
  };
}

export function blockToTimeBlockRequest(block: EditableRoutineBlock): TimeBlockRequest {
  return {
    time: timeStringFromInt(block.timeInt),
    time_int: block.timeInt,
    notification_enabled: block.notificationEnabled,
    sessions: block.items.map((item, index) => routineItemToSession(item, index + 1)),
  };
}
