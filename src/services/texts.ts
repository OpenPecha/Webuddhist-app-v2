import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { DetailTableOfContentResponse } from '@/types/texts';

export async function fetchTextReaderDetails(
  textId: string,
  request: { segmentId?: string; size?: number } = {},
): Promise<DetailTableOfContentResponse> {
  const { data } = await http.post<DetailTableOfContentResponse>(
    ENDPOINTS.texts.textDetails(textId),
    {
      segment_id: request.segmentId ?? null,
      size: request.size ?? 20,
    },
  );
  return data;
}
