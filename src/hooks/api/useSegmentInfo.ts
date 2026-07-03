import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchSegmentInfo } from '@/services/segments';
import { useQuery } from '@tanstack/react-query';

export function useSegmentInfo(segmentId: string | null, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.segments.info(segmentId ?? ''),
    queryFn: () => fetchSegmentInfo(segmentId!),
    enabled: enabled && !!segmentId,
    staleTime: 5 * 60_000,
  });
}
