import type { PublicPlanTask } from '@/types/plan-catalog';
import type { PlanReadingStartAt, PlanTextItem } from '@/types/plan-navigation';

export interface PlanTaskForNavigation {
  id: string;
  title?: string | null;
  display_order?: number;
  is_completed?: boolean;
  subtasks: {
    id: string;
    content?: string | null;
    is_completed?: boolean;
    content_type?: string;
    source_text_id?: string | null;
    segment_ids?: string[] | null;
    pecha_segment_id?: string | null;
    start_ms?: number | null;
    end_ms?: number | null;
    audio_url?: string | null;
    display_order?: number | null;
  }[];
}

function normalizeContentType(raw?: string): 'TEXT' | 'SOURCE_REFERENCE' | null {
  const upper = (raw ?? '').toUpperCase();
  if (upper === 'TEXT' || upper === 'INLINE_TEXT') return 'TEXT';
  if (upper === 'SOURCE_REFERENCE') return 'SOURCE_REFERENCE';
  return null;
}

function resolveSubtaskContentType(
  sub: PlanTaskForNavigation['subtasks'][number],
): 'TEXT' | 'SOURCE_REFERENCE' | null {
  // Prefer linked text reader when source_text_id exists (even if inline content is present).
  if (hasSourceText(sub.source_text_id)) {
    return 'SOURCE_REFERENCE';
  }

  const normalized = normalizeContentType(sub.content_type);
  if (normalized === 'TEXT' && hasInlineContent(sub.content)) {
    return 'TEXT';
  }
  if (normalized === 'SOURCE_REFERENCE') {
    return null;
  }
  if (normalized) return null;

  if (hasInlineContent(sub.content)) return 'TEXT';
  return null;
}

function hasInlineContent(content?: string | null): boolean {
  return !!content && content.trim().length > 0;
}

function hasSourceText(sourceTextId?: string | null): boolean {
  return !!sourceTextId && sourceTextId.length > 0;
}

function segmentFields(sub: PlanTaskForNavigation['subtasks'][number]) {
  return {
    segmentIds: sub.segment_ids ?? null,
    pechaSegmentId: sub.pecha_segment_id ?? null,
  };
}

function audioSegmentFields(sub: PlanTaskForNavigation['subtasks'][number]) {
  return {
    startMs: sub.start_ms ?? null,
    endMs: sub.end_ms ?? null,
  };
}

export function resolveInitialSegmentId(item: PlanTextItem): string | undefined {
  if (item.segmentIds?.length) return item.segmentIds[0];
  return item.pechaSegmentId ?? undefined;
}

export function subtaskToPlanTextItem(
  sub: PlanTaskForNavigation['subtasks'][number],
  task: PlanTaskForNavigation,
): PlanTextItem | null {
  const contentType = resolveSubtaskContentType(sub);
  if (!contentType) return null;

  const base = {
    subTaskId: sub.id,
    taskId: task.id,
    taskTitle: task.title ?? '',
    contentType,
    content: sub.content,
    audioUrl: sub.audio_url,
    isCompleted: sub.is_completed,
    ...audioSegmentFields(sub),
  };

  if (contentType === 'SOURCE_REFERENCE') {
    return {
      ...base,
      sourceTextId: sub.source_text_id,
      ...segmentFields(sub),
    };
  }

  return base;
}

export function isTaskNavigable(task: PlanTaskForNavigation): boolean {
  return task.subtasks.some((sub) => resolveSubtaskContentType(sub) != null);
}

/** First navigable subtask per task, sorted by display_order (Flutter parity). */
export function buildPlanTextItems(tasks: PlanTaskForNavigation[]): PlanTextItem[] {
  const sorted = [...tasks].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );

  const items: PlanTextItem[] = [];
  for (const task of sorted) {
    const subs = [...task.subtasks].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
    );
    for (const sub of subs) {
      const item = subtaskToPlanTextItem(sub, task);
      if (item) {
        items.push(item);
        break;
      }
    }
  }
  return items;
}

export function findItemIndex(
  items: PlanTextItem[],
  target: { subTaskId?: string; taskId?: string },
): number {
  if (target.subTaskId) {
    const idx = items.findIndex((i) => i.subTaskId === target.subTaskId);
    if (idx >= 0) return idx;
  }
  if (target.taskId) {
    const idx = items.findIndex((i) => i.taskId === target.taskId);
    if (idx >= 0) return idx;
  }
  return -1;
}

export function findFirstIncompleteItemIndex(items: PlanTextItem[]): number {
  const idx = items.findIndex((i) => !i.isCompleted);
  return idx >= 0 ? idx : 0;
}

export function resolveStartIndex(items: PlanTextItem[], startAt: PlanReadingStartAt): number {
  if (items.length === 0) return 0;

  if (startAt === 'first-incomplete') {
    return findFirstIncompleteItemIndex(items);
  }

  const idx = findItemIndex(items, startAt);
  return idx >= 0 ? idx : 0;
}

export function taskHasAudio(task: PlanTaskForNavigation, dayAudioUrl?: string | null): boolean {
  if (dayAudioUrl) return true;
  return task.subtasks.some((s) => !!s.audio_url);
}

export interface PlanReadingRoute {
  pathname: '/reader/[textId]' | '/plan-text/[subtaskId]';
  params: Record<string, string>;
}

export function mapPublicPlanTasksToNavigation(tasks: PublicPlanTask[]): PlanTaskForNavigation[] {
  return [...tasks]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((task) => ({
      id: task.id,
      title: task.title,
      display_order: task.display_order,
      subtasks: [...task.subtasks]
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((sub) => ({
          id: sub.id,
          content: sub.content,
          content_type: sub.content_type,
          source_text_id: sub.source_text_id,
          display_order: sub.display_order,
        })),
    }));
}

function buildReadingRouteParams(options: {
  planId: string;
  dayNumber: number;
  subTaskId: string;
  taskIndex: number;
  itemCount: number;
  autoPlay?: boolean;
  dayAudioUrl?: string | null;
  preview?: boolean;
}): Record<string, string> {
  const baseParams: Record<string, string> = {
    planId: options.planId,
    dayNumber: String(options.dayNumber),
    subTaskId: options.subTaskId,
    taskIndex: String(options.taskIndex),
    itemCount: String(options.itemCount),
    autoPlay: options.autoPlay ? '1' : '0',
  };
  if (options.dayAudioUrl) {
    baseParams.dayAudioUrl = options.dayAudioUrl;
  }
  if (options.preview) {
    baseParams.preview = '1';
  }
  return baseParams;
}

export function resolvePlanReadingRoute(options: {
  planId: string;
  dayNumber: number;
  tasks: PlanTaskForNavigation[];
  dayAudioUrl?: string | null;
  startAt: PlanReadingStartAt;
  autoPlay?: boolean;
  preview?: boolean;
}): PlanReadingRoute | null {
  const items = buildPlanTextItems(options.tasks);
  if (items.length === 0) return null;

  const index = resolveStartIndex(items, options.startAt);
  const item = items[index];
  if (!item) return null;

  const baseParams = buildReadingRouteParams({
    planId: options.planId,
    dayNumber: options.dayNumber,
    subTaskId: item.subTaskId,
    taskIndex: index,
    itemCount: items.length,
    autoPlay: options.autoPlay,
    dayAudioUrl: options.dayAudioUrl,
    preview: options.preview,
  });

  if (item.sourceTextId) {
    return {
      pathname: '/reader/[textId]',
      params: { textId: item.sourceTextId, ...baseParams },
    };
  }

  if (item.contentType === 'TEXT') {
    return {
      pathname: '/plan-text/[subtaskId]',
      params: { subtaskId: item.subTaskId, ...baseParams },
    };
  }

  return null;
}

export function resolvePlanReadingRouteForIndex(options: {
  planId: string;
  dayNumber: number;
  items: PlanTextItem[];
  index: number;
  dayAudioUrl?: string | null;
  autoPlay?: boolean;
  preview?: boolean;
}): PlanReadingRoute | null {
  const item = options.items[options.index];
  if (!item) return null;

  const baseParams = buildReadingRouteParams({
    planId: options.planId,
    dayNumber: options.dayNumber,
    subTaskId: item.subTaskId,
    taskIndex: options.index,
    itemCount: options.items.length,
    autoPlay: options.autoPlay,
    dayAudioUrl: options.dayAudioUrl,
    preview: options.preview,
  });

  if (item.sourceTextId) {
    return {
      pathname: '/reader/[textId]',
      params: { textId: item.sourceTextId, ...baseParams },
    };
  }

  if (item.contentType === 'TEXT') {
    return {
      pathname: '/plan-text/[subtaskId]',
      params: { subtaskId: item.subTaskId, ...baseParams },
    };
  }

  return null;
}
