import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchRecitations } from '@/services/recitations';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export function useRecitations() {
  const { i18n } = useTranslation();
  const language = i18n.language;

  return useQuery({
    queryKey: QUERY_KEYS.recitations.list(language),
    queryFn: () => fetchRecitations(language),
  });
}
