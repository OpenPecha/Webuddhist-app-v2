import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchRecitations } from '@/services/recitations';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useQuery } from '@tanstack/react-query';

export function useRecitations() {
  const language = useContentLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.recitations.list(language),
    queryFn: () => fetchRecitations(language),
  });
}
