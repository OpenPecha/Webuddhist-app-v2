import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchTextDetail } from '@/services/texts';
import { useQuery } from '@tanstack/react-query';

export function useTextDetail(textId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.texts.detail(textId ?? ''),
    queryFn: () => fetchTextDetail(textId!),
    enabled: !!textId,
  });
}
