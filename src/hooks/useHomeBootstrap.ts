import { QUERY_KEYS } from '@/constants/query-keys';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import {
  requestNotificationPermissions,
  triggerNotificationSync,
} from '@/lib/notifications';
import { fetchUserPlans } from '@/services/plans';
import { usePendingOnboardingPlan } from '@/providers/pending-onboarding-plan';
import { useGuest } from '@/providers/guest';
import { getCurrentDay } from '@/utils/plan-utils';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useAuth0 } from 'react-native-auth0';
import { getApiLanguageSync } from '@/lib/i18n';

/** Home-screen bootstrap: notification permission, user-plans refresh, pending plan nav. */
export function useHomeBootstrap() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { consumePendingPlan } = usePendingOnboardingPlan();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    if (!user || isGuest) return;

    hasRunRef.current = true;

    const run = async () => {
      let permissionGranted = false;
      try {
        permissionGranted = await requestNotificationPermissions();
      } catch {
        // Permission flow is best-effort; continue bootstrap either way.
      }

      const maxAttempts = 3;
      let plansData = null;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.plans.userPlans(language, 0, 50),
          });
          await queryClient.refetchQueries({
            queryKey: QUERY_KEYS.plans.userPlans(language, 0, 50),
          });
          plansData = await fetchUserPlans(getApiLanguageSync(), 0, 50);
          break;
        } catch {
          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 400));
          }
        }
      }

      if (permissionGranted) {
        try {
          await triggerNotificationSync({
            trigger: 'appLaunch',
            queryClient,
            language,
            loggedIn: true,
            isGuest: false,
            plans: plansData?.plans,
          });
        } catch {
          // Notification sync is best-effort on launch.
        }
      }

      const plan = consumePendingPlan();
      if (!plan) return;

      const selectedDay = getCurrentDay(plan);
      router.push({
        pathname: '/practice/details',
        params: {
          planId: plan.id,
          selectedDay: String(selectedDay),
          title: plan.title,
        },
      });
      router.replace('/practice/my-practices');
    };

    void run();
  }, [
    consumePendingPlan,
    isGuest,
    language,
    queryClient,
    router,
    user,
  ]);
}
