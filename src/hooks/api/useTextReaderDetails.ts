import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchTextReaderDetails } from '@/services/texts';
import { useQuery } from '@tanstack/react-query';

export function useTextReaderDetails(
  textId: string | undefined,
  segmentId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: QUERY_KEYS.texts.readerDetails(textId ?? '', segmentId ?? ''),
    queryFn: () =>
      fetchTextReaderDetails(textId!, { segmentId, size: 20 }),
    enabled: !!textId && enabled,
  });
}
