import { useUserPlans } from '@/hooks/api/useUserPlans';
import { useGuest } from '@/providers/guest';
import { usePendingNotificationNav } from '@/providers/pending-notification-nav';
import { getCurrentDay, resolveUserPlanForItem } from '@/utils/plan-utils';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useAuth0 } from 'react-native-auth0';

/** Consumes a notification tap once the Practice tab mounts and opens the target plan or reader. */
export function usePendingRoutineNavigation() {
  const router = useRouter();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { pending, consumePendingNav } = usePendingNotificationNav();
  const { data: userPlansData } = useUserPlans();
  const userPlans = useMemo(() => userPlansData?.plans ?? [], [userPlansData]);

  useEffect(() => {
    if (!pending || isGuest || !user) return;

    const nav = consumePendingNav();
    if (!nav) return;

    if (nav.itemType === 'recitation') {
      router.push({ pathname: '/reader/[textId]', params: { textId: nav.itemId } });
      return;
    }

    const planId = nav.planId ?? nav.itemId;
    const userPlan = resolveUserPlanForItem(planId, userPlans);
    const selectedDay = userPlan ? getCurrentDay(userPlan) : nav.day;
    router.push({
      pathname: '/practice/details',
      params: {
        planId,
        title: userPlan?.title ?? '',
        ...(selectedDay != null ? { selectedDay: String(selectedDay) } : {}),
      },
    });
  }, [consumePendingNav, isGuest, pending, router, user, userPlans]);
}
