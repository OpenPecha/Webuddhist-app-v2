export interface SegmentTranslation {
  segmentId: string;
  textId: string;
  title: string;
  source: string;
  language: string;
  content: string;
  license?: string | null;
}

export interface SegmentTranslationResponse {
  translations: SegmentTranslation[];
}

export function parseSegmentTranslationResponse(
  data: Record<string, unknown>,
): SegmentTranslationResponse {
  const raw = (data.translations as unknown[]) ?? [];
  const translations: SegmentTranslation[] = raw
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({
      segmentId: String(item.segment_id ?? ''),
      textId: String(item.text_id ?? ''),
      title: String(item.title ?? ''),
      source: String(item.source ?? ''),
      language: String(item.language ?? ''),
      content: String(item.content ?? ''),
      license: item.license != null ? String(item.license) : null,
    }));

  return { translations };
}
