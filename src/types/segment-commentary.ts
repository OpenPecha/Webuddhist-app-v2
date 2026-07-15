export interface MappedSegment {
  segmentId: string;
  content: string;
}

export interface SegmentCommentary {
  textId: string;
  title: string;
  segments: MappedSegment[];
  language: string;
  count: number;
  source?: string | null;
  license?: string | null;
}

export interface SegmentCommentaryResponse {
  commentaries: SegmentCommentary[];
}

export function parseSegmentCommentaryResponse(
  data: Record<string, unknown>,
): SegmentCommentaryResponse {
  const raw = (data.commentaries as unknown[]) ?? [];
  const commentaries: SegmentCommentary[] = raw
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => {
      const rawSegments = (item.segments as unknown[]) ?? [];
      const segments: MappedSegment[] = rawSegments
        .filter((s): s is Record<string, unknown> => !!s && typeof s === 'object')
        .map((s) => ({
          segmentId: String(s.segment_id ?? ''),
          content: String(s.content ?? ''),
        }));

      return {
        textId: String(item.text_id ?? ''),
        title: String(item.title ?? ''),
        segments,
        language: String(item.language ?? ''),
        count: Number(item.count) || segments.length,
        source: item.source != null ? String(item.source) : null,
        license: item.license != null ? String(item.license) : null,
      };
    });

  return { commentaries };
}
