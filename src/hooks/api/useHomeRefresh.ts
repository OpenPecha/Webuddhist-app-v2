import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export function useHomeRefresh() {
  const queryClient = useQueryClient();
  const language = useContentLanguage();

  return useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.series.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.today() }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.verseOfDay.today(language),
      }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.streak.me() }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.routineInfo.me() }),
    ]);

    await Promise.all([
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.series.all }),
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.calendar.today() }),
      queryClient.refetchQueries({
        queryKey: QUERY_KEYS.verseOfDay.today(language),
      }),
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.streak.me() }),
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.routineInfo.me() }),
    ]);
  }, [language, queryClient]);
}
