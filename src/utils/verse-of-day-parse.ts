import type { VerseOfDay, VerseOfDayGroupInfo } from '@/types/verse-of-day';

function parseGroupInfo(raw: unknown): VerseOfDayGroupInfo {
  const g = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(g.id ?? ''),
    title: String(g.title ?? ''),
    subTitle: String(g.sub_title ?? ''),
    description: String(g.description ?? ''),
    language: String(g.language ?? ''),
  };
}

export function parseVerseOfDayResponse(data: Record<string, unknown>): VerseOfDay {
  const vod = (data.verse_of_day as Record<string, unknown> | undefined) ?? data;
  const groupInfoRaw = (vod.group_info as unknown[]) ?? [];

  return {
    id: String(vod.id ?? ''),
    verse: String(vod.verse ?? ''),
    imageUrl: String(vod.image_url ?? ''),
    refId: String(vod.ref_id ?? ''),
    refType: String(vod.ref_type ?? ''),
    date: String(vod.date ?? ''),
    groupInfo: groupInfoRaw.map(parseGroupInfo),
  };
}
