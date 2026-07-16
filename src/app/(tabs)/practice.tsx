import '@/lib/i18n';
import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { RoutineBlockSection } from '@/components/practice/RoutineBlockSection';
import { RoutineEmptyState } from '@/components/practice/RoutineEmptyState';
import { useRoutine } from '@/hooks/api/useRoutine';
import { useUserPlans } from '@/hooks/api/useUserPlans';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useGuest } from '@/providers/guest';
import { routineHasItems, type RoutineItem } from '@/types/routine';
import { usePendingNotificationNav } from '@/providers/pending-notification-nav';
import {
  getCurrentDay,
  resolveUserPlanForItem,
} from '@/utils/plan-utils';
import {
  resolveUserPlanForRoutineItem,
  selectedDayForRoutinePlan,
} from '@/utils/routine-navigation';
import { useQueryClient } from '@tanstack/react-query';
import { type Href, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatTodayDate(): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message.replace(/^Exception:\s*/, '').trim();
  }
  return '';
}

function EmptyScaffold({
  title,
  onBuildRoutine,
  onRefresh,
  refreshing,
}: {
  title: string;
  onBuildRoutine: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>
        <Text className="text-[28px] font-bold text-foreground">
          {title}
        </Text>
      </View>
      <View style={{ height: 12 }} />
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ height: 1, backgroundColor: '#e8e8e4' }} />
      </View>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <RoutineEmptyState onBuildRoutine={onBuildRoutine} />
      </ScrollView>
    </View>
  );
}

function RoutineFilledHeader({
  title,
  editLabel,
  onEdit,
}: {
  title: string;
  editLabel: string;
  onEdit: () => void;
}) {
  return (
    <View>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Text className="flex-1 text-[28px] font-bold text-foreground">
          {title}
        </Text>
        <Pressable onPress={onEdit} style={{ paddingTop: 8 }}>
          <Text className="text-base font-semibold text-foreground">
            {editLabel}
          </Text>
        </Pressable>
      </View>
      <Text className="px-5 text-[15px] text-muted-foreground">
        {formatTodayDate()}
      </Text>
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        <View style={{ height: 1, backgroundColor: '#e8e8e4' }} />
      </View>
    </View>
  );
}

function PracticeErrorState({
  message,
  onRetry,
  onRefresh,
  refreshing,
}: {
  message: string;
  onRetry: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ alignItems: 'center', gap: 12 }}>
        <Text className="text-center text-xl font-semibold text-foreground">
          {t('practice.routine_load_error')}
        </Text>
        {message ? (
          <Text className="text-center text-[15px] text-muted-foreground">
            {message}
          </Text>
        ) : null}
        <Pressable
          onPress={onRetry}
          style={{
            marginTop: 12,
            backgroundColor: '#000',
            borderRadius: 24,
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}
        >
          <Text className="text-base font-semibold text-white">
            {t('practice.retry')}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const contentLanguage = useContentLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth0();
  const { isGuest } = useGuest();
  const { visible: loginDrawerVisible, session: loginDrawerSession, showLoginDrawer, hideLoginDrawer } =
    useLoginDrawer();

  const {
    data: routine,
    isLoading: routineLoading,
    isFetching: routineFetching,
    error: routineError,
    refetch: refetchRoutine,
  } = useRoutine();

  const {
    data: userPlansData,
    refetch: refetchUserPlans,
    isFetching: plansFetching,
  } = useUserPlans();

  const userPlans = userPlansData?.plans ?? [];
  const refreshing = routineFetching || plansFetching;
  const [resolvingItemId, setResolvingItemId] = useState<string | null>(null);
  const { pending, consumePendingNav } = usePendingNotificationNav();

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

  const refreshAll = useCallback(async () => {
    await Promise.all([refetchRoutine(), refetchUserPlans()]);
    queryClient.invalidateQueries({ queryKey: ['plans', 'completion'] });
  }, [queryClient, refetchRoutine, refetchUserPlans]);

  const onBuildRoutine = useCallback(() => {
    if (isGuest || !user) {
      showLoginDrawer();
      return;
    }
    router.push('/practice/edit-routine' as Href);
  }, [isGuest, router, showLoginDrawer, user]);

  const onRoutineItemPress = useCallback(
    async (item: RoutineItem) => {
      if (isGuest || !user) {
        showLoginDrawer();
        return;
      }

      if (item.type === 'recitation') {
        router.push({ pathname: '/reader/[textId]', params: { textId: item.id } });
        return;
      }

      if (item.type === 'series') {
        if (item.currentPlanId) {
          const userPlan = resolveUserPlanForItem(item.currentPlanId, userPlans);
          const selectedDay = userPlan ? getCurrentDay(userPlan) : undefined;
          router.push({
            pathname: '/practice/details',
            params: {
              planId: item.currentPlanId,
              title: item.currentPlanTitle ?? item.title,
              ...(selectedDay != null ? { selectedDay: String(selectedDay) } : {}),
            },
          });
        } else {
          router.push(`/series/${item.id}`);
        }
        return;
      }

      setResolvingItemId(item.id);
      try {
        const userPlan = await resolveUserPlanForRoutineItem(
          item,
          userPlans,
          contentLanguage,
        );
        if (!userPlan) {
          Alert.alert(t('practice.not_found'));
          return;
        }
        const selectedDay = selectedDayForRoutinePlan(userPlan, item);
        router.push({
          pathname: '/practice/details',
          params: {
            planId: userPlan.id,
            selectedDay: String(selectedDay),
            title: userPlan.title,
          },
        });
      } finally {
        setResolvingItemId(null);
      }
    },
    [contentLanguage, isGuest, router, showLoginDrawer, t, user, userPlans],
  );

  const showGuestEmpty = isGuest || !user;

  let content: React.ReactNode;

  if (showGuestEmpty) {
    content = (
      <EmptyScaffold
        title={t('practice.routine_empty_title')}
        onBuildRoutine={onBuildRoutine}
        onRefresh={refreshAll}
        refreshing={refreshing}
      />
    );
  } else if (authLoading || (routineLoading && routine === undefined)) {
    content = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (routineError && routine === undefined) {
    const message = getErrorMessage(routineError) || t('practice.routine_load_error');
    content = (
      <PracticeErrorState
        message={message}
        onRetry={() => refetchRoutine()}
        onRefresh={refreshAll}
        refreshing={refreshing}
      />
    );
  } else if (routine && routineHasItems(routine)) {
    content = (
      <FlatList
        data={routine.blocks}
        keyExtractor={(block) => block.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshAll} />
        }
        ListHeaderComponent={
          <RoutineFilledHeader
            title={t('practice.routine_title')}
            editLabel={t('practice.routine_edit')}
            onEdit={onBuildRoutine}
          />
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
            <RoutineBlockSection
              block={item}
              userPlans={userPlans}
              onItemPress={onRoutineItemPress}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    );
  } else {
    content = (
      <EmptyScaffold
        title={t('practice.routine_empty_title')}
        onBuildRoutine={onBuildRoutine}
        onRefresh={refreshAll}
        refreshing={refreshing}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      {resolvingItemId ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(253,253,252,0.6)',
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : null}
      {content}
      <LoginDrawer
        key={loginDrawerSession}
        visible={loginDrawerVisible}
        onClose={hideLoginDrawer}
      />
    </View>
  );
}
