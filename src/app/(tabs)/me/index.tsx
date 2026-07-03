import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { MeProfileHeader } from '@/components/me/MeProfileHeader';
import { MeStatsSection } from '@/components/me/MeStatsSection';
import { MeStatsSectionSkeleton } from '@/components/me/MeStatsSectionSkeleton';
import { ProfileAvatar } from '@/components/settings/ProfileAvatar';
import { Text } from '@/components/ui/text';
import { Gear } from '@/constants/settings-icons';
import { useUserProfile } from '@/hooks/api/useUserProfile';
import { useUserStats } from '@/hooks/api/useUserStats';
import { useNavigateOnce } from '@/hooks/useNavigateOnce';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGuest } from '@/providers/guest';
import { EMPTY_USER_STATS } from '@/types/user-stats';
import { type Href } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, AppState, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { BookmarkSimple } from 'phosphor-react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MeScreen() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth0();
  const { isGuest } = useGuest();
  const { foreground, mutedForeground } = useThemeColors();
  const insets = useSafeAreaInsets();
  const navigateOnce = useNavigateOnce();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const showGuest = !user || isGuest;
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useUserProfile();
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useUserStats();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchProfile(), refetchStats()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchProfile, refetchStats]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        void refetchStats();
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, [refetchStats]);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="min-h-12 flex-row items-center justify-between px-4 pb-2">
        <Text className="text-2xl font-bold">{t('nav.me')}</Text>
        <Pressable
          onPress={() => {
            const href = '/me/settings/' as Href;
            navigateOnce(href);
          }}
          className="h-10 w-10 items-center justify-center active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('settings.title')}
        >
          <Gear size={24} color={foreground} />
        </Pressable>
      </View>

      {showGuest ? (
        <View className="flex-1 justify-center px-8 pb-16">
          <View className="items-center">
            <ProfileAvatar size={104} />
            <Text className="mt-5 text-center text-[34px] font-bold leading-tight">
              {t('me.guest_headline')}
            </Text>
            <Text className="mt-3 text-center text-base" style={{ color: mutedForeground }}>
              {t('me.guest_subtitle')}
            </Text>
            <View className="mt-10 w-full">
              {authLoading ? (
                <ActivityIndicator size="large" className="py-6" />
              ) : (
                <SocialLoginButtons />
              )}
            </View>
          </View>
        </View>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          <MeProfileHeader
            profile={profile}
            authUser={user}
            loading={profileLoading && !profile}
          />
          {statsLoading && !stats ? (
            <MeStatsSectionSkeleton />
          ) : (
            <MeStatsSection stats={stats ?? EMPTY_USER_STATS} />
          )}
          <Pressable
            onPress={() => {
              if (showGuest) {
                showLoginDrawer();
                return;
              }
              navigateOnce('/me/bookmarks' as Href);
            }}
            className="mx-4 mt-6 flex-row items-center rounded-xl border border-border bg-card px-4 py-3 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel={t('bookmarks.title')}
          >
            <BookmarkSimple size={22} color={foreground} />
            <Text className="ml-3 flex-1 text-base font-medium">{t('bookmarks.title')}</Text>
            <Text className="text-muted-foreground">›</Text>
          </Pressable>
        </ScrollView>
      )}
      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </View>
  );
}
