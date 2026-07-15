import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useTriggerNotificationSync } from '@/hooks/useTriggerNotificationSync';
import { enrollInSeries } from '@/services/series';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export function useEnrollSeries() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const language = useContentLanguage();
  const triggerSync = useTriggerNotificationSync();

  return useMutation({
    mutationFn: enrollInSeries,
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.series.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.series.userEnrollments(language),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.series.userProgress(variables.series_id, language),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.routine.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans.all });
      await triggerSync('planEnrolled');
      router.push({
        pathname: '/practice/edit-routine',
        params: { enrollSeriesId: variables.series_id },
      });
    },
  });
}
