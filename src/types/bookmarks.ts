export type BookmarkCreateType = 'TEXT' | 'VERSE' | 'TIMER' | 'ACCUMULATOR' | 'SERIES';

export type BookmarkItemType =
  | 'TEXT'
  | 'PLAN'
  | 'SERIES'
  | 'ACCUMULATOR'
  | 'TIMER'
  | 'VERSE';

export interface BookmarkExistsResult {
  exists: boolean;
  id?: string | null;
}

export interface BookmarkDTO {
  id: string;
  type: BookmarkItemType;
  sourceId: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
  nestedTitle?: string | null;
  excerpt?: string | null;
  imageUrl?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  textId?: string | null;
  timerDurationMs?: number | null;
}

export interface BookmarksResponse {
  bookmarks: BookmarkDTO[];
  total: number;
  skip: number;
  limit: number;
}

export type BookmarkTab = 'all' | 'plans' | 'mala' | 'timers' | 'texts';

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function seriesTitle(series: Record<string, unknown> | undefined): string | undefined {
  const meta = series?.metadata;
  if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
    return (meta as Record<string, unknown>).title as string | undefined;
  }
  if (Array.isArray(meta) && meta.length > 0 && typeof meta[0] === 'object' && meta[0]) {
    return (meta[0] as Record<string, unknown>).title as string | undefined;
  }
  return undefined;
}

export function parseBookmarkItemType(value: unknown): BookmarkItemType | null {
  if (typeof value !== 'string') return null;
  switch (value) {
    case 'TEXT':
    case 'PLAN':
    case 'SERIES':
    case 'ACCUMULATOR':
    case 'TIMER':
    case 'VERSE':
      return value;
    default:
      return null;
  }
}

export function parseBookmarkDto(json: Record<string, unknown>): BookmarkDTO | null {
  const type = parseBookmarkItemType(json.type);
  const id = json.id as string | undefined;
  const sourceId = json.source_id as string | undefined;
  const createdAt = parseDate(json.created_at);
  if (!type || !id || !sourceId || !createdAt) return null;

  const text = json.text as Record<string, unknown> | undefined;
  const plan = json.plan as Record<string, unknown> | undefined;
  const series = json.series as Record<string, unknown> | undefined;
  const accumulator = json.accumulator as Record<string, unknown> | undefined;
  const timer = json.timer as Record<string, unknown> | undefined;
  const planMeta = plan?.metadata as Record<string, unknown> | undefined;
  const segment = text?.segment as Record<string, unknown> | undefined;

  let startDate: Date | null = null;
  let endDate: Date | null = null;
  if (plan) {
    startDate = parseDate(plan.start_date);
    endDate = parseDate(plan.end_date);
  } else if (series) {
    startDate = parseDate(series.start_date);
    endDate = parseDate(series.end_date);
  }

  return {
    id,
    type,
    sourceId,
    name: (json.name as string | undefined) ?? null,
    createdAt,
    updatedAt: parseDate(json.updated_at) ?? createdAt,
    nestedTitle:
      (text?.title as string | undefined) ??
      (planMeta?.title as string | undefined) ??
      seriesTitle(series) ??
      (accumulator?.title as string | undefined) ??
      (timer?.title as string | undefined) ??
      null,
    excerpt: (segment?.content as string | undefined) ?? null,
    imageUrl:
      (plan?.image as string | undefined) ??
      (series?.image as string | undefined) ??
      (accumulator?.image as string | undefined) ??
      null,
    startDate,
    endDate,
    textId: (text?.id as string | undefined) ?? null,
    timerDurationMs: (timer?.duration as number | undefined) ?? null,
  };
}

export function parseBookmarksResponse(data: Record<string, unknown>): BookmarksResponse {
  const raw = (data.bookmarks as unknown[]) ?? [];
  const bookmarks = raw
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map(parseBookmarkDto)
    .filter((b): b is BookmarkDTO => b != null);

  return {
    bookmarks,
    total: Number(data.total) || bookmarks.length,
    skip: Number(data.skip) || 0,
    limit: Number(data.limit) || bookmarks.length,
  };
}

export function bookmarkDisplayTitle(bookmark: BookmarkDTO): string {
  const preferred = bookmark.nestedTitle ?? bookmark.name;
  if (preferred?.trim()) return preferred.trim();
  switch (bookmark.type) {
    case 'TIMER':
      return 'Timer';
    case 'TEXT':
    case 'VERSE':
      return 'Untitled text';
    case 'PLAN':
      return 'Plan';
    case 'SERIES':
      return 'Series';
    case 'ACCUMULATOR':
      return 'Mala';
    default:
      return 'Bookmark';
  }
}

export function bookmarkIsText(bookmark: BookmarkDTO): boolean {
  return bookmark.type === 'TEXT' || bookmark.type === 'VERSE';
}

export function bookmarkCreateTypeFromItem(
  type: BookmarkItemType,
): BookmarkCreateType | null {
  switch (type) {
    case 'TEXT':
      return 'TEXT';
    case 'VERSE':
      return 'VERSE';
    case 'SERIES':
      return 'SERIES';
    case 'ACCUMULATOR':
      return 'ACCUMULATOR';
    case 'TIMER':
      return 'TIMER';
    default:
      return null;
  }
}
