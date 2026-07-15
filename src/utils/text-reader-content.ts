import type { DetailSection, DetailTableOfContentResponse, DetailTextSegment } from '@/types/texts';

function collectSegmentObjectsFromSection(
  section: DetailSection,
  targetIds: Set<string> | null,
  out: DetailTextSegment[],
): void {
  for (const segment of section.segments ?? []) {
    if (!segment.content?.trim()) continue;
    if (targetIds && !targetIds.has(segment.segment_id)) continue;
    out.push(segment);
  }
  for (const child of section.sections ?? []) {
    collectSegmentObjectsFromSection(child, targetIds, out);
  }
}

/** Flatten segments from reader details for tappable list rendering. */
export function flattenReaderSegments(
  response: DetailTableOfContentResponse,
  segmentIds?: string[] | null,
): DetailTextSegment[] {
  const targetIds = segmentIds?.length ? new Set(segmentIds.map(String)) : null;
  const segments: DetailTextSegment[] = [];

  for (const section of response.content?.sections ?? []) {
    collectSegmentObjectsFromSection(section, targetIds, segments);
  }

  return segments;
}

function collectSegmentsFromSection(
  section: DetailSection,
  targetIds: Set<string> | null,
  out: string[],
): void {
  for (const segment of section.segments ?? []) {
    if (!segment.content?.trim()) continue;
    if (targetIds && !targetIds.has(segment.segment_id)) continue;
    out.push(segment.content.trim());
  }
  for (const child of section.sections ?? []) {
    collectSegmentsFromSection(child, targetIds, out);
  }
}

/** Extract segment text from POST /texts/{id}/details response (Flutter reader parity). */
export function extractSegmentContent(
  response: DetailTableOfContentResponse,
  segmentIds?: string[] | null,
): string {
  const targetIds =
    segmentIds?.length ? new Set(segmentIds.map(String)) : null;
  const parts: string[] = [];

  for (const section of response.content?.sections ?? []) {
    collectSegmentsFromSection(section, targetIds, parts);
  }

  if (parts.length > 0) return parts.join('\n\n');
  return response.text_detail?.summary?.trim() ?? '';
}
