import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { SegmentInfo } from '@/types/segment-info';
import { parseSegmentInfo } from '@/types/segment-info';
import type { SegmentCommentaryResponse } from '@/types/segment-commentary';
import { parseSegmentCommentaryResponse } from '@/types/segment-commentary';
import type { SegmentTranslationResponse } from '@/types/segment-translation';
import { parseSegmentTranslationResponse } from '@/types/segment-translation';

export async function fetchSegmentInfo(segmentId: string): Promise<SegmentInfo> {
  const { data } = await http.get<Record<string, unknown>>(ENDPOINTS.segments.info(segmentId));
  return parseSegmentInfo(data);
}

export async function fetchSegmentCommentaries(
  segmentId: string,
): Promise<SegmentCommentaryResponse> {
  const { data } = await http.get<Record<string, unknown>>(
    ENDPOINTS.segments.commentaries(segmentId),
  );
  return parseSegmentCommentaryResponse(data);
}

export async function fetchSegmentTranslations(
  segmentId: string,
): Promise<SegmentTranslationResponse> {
  const { data } = await http.get<Record<string, unknown>>(
    ENDPOINTS.segments.translations(segmentId),
  );
  return parseSegmentTranslationResponse(data);
}
