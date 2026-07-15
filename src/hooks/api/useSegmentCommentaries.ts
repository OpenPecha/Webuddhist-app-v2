import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchSegmentCommentaries } from '@/services/segments';
import { useQuery } from '@tanstack/react-query';

export function useSegmentCommentaries(segmentId: string | null, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.segments.commentaries(segmentId ?? ''),
    queryFn: () => fetchSegmentCommentaries(segmentId!),
    enabled: enabled && !!segmentId,
    staleTime: 5 * 60_000,
  });
}
