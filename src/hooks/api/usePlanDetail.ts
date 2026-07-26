import { getApiLanguageSync } from '@/lib/i18n';
import { QUERY_KEYS } from '@/constants/query-keys';
import { fetchPlanById } from '@/services/plans';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useQuery } from '@tanstack/react-query';

export function usePlanDetail(planId: string) {
  const language = useContentLanguage();

  return useQuery({
    queryKey: QUERY_KEYS.plans.publicDetail(planId, language),
    queryFn: () => fetchPlanById(planId, getApiLanguageSync()),
    enabled: !!planId,
  });
}
