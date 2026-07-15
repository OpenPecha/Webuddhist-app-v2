import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchSegmentTranslations } from '@/services/segments';
import { useQuery } from '@tanstack/react-query';

export function useSegmentTranslations(segmentId: string | null, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.segments.translations(segmentId ?? ''),
    queryFn: () => fetchSegmentTranslations(segmentId!),
    enabled: enabled && !!segmentId,
    staleTime: 5 * 60_000,
  });
}
