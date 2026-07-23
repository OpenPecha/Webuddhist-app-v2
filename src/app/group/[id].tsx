import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { GroupSocialLinksSheet } from '@/components/connect/GroupSocialLinksSheet';
import { GroupProfileAboutTab } from '@/components/group-profile/GroupProfileAboutTab';
import { GroupProfileAppBar } from '@/components/group-profile/GroupProfileAppBar';
import { GroupProfileBanner } from '@/components/group-profile/GroupProfileBanner';
import { GroupProfileDescription } from '@/components/group-profile/GroupProfileDescription';
import { GroupProfileHeader } from '@/components/group-profile/GroupProfileHeader';
import { GroupProfileJoinButton } from '@/components/group-profile/GroupProfileJoinButton';
import { GroupProfileLinksRow } from '@/components/group-profile/GroupProfileLinksRow';
import { GroupProfilePracticesTab } from '@/components/group-profile/GroupProfilePracticesTab';
import {
  GroupProfileTabBar,
  type GroupProfileTab,
} from '@/components/group-profile/GroupProfileTabBar';
import {
  useGroupProfile,
  useJoinGroup,
  useLeaveGroup,
  useFollowGroup,
  useUnfollowGroup,
} from '@/hooks/api/useDiscoverGroups';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/utils/cn';
import type { GroupSocialLink } from '@/lib/group-profile-format';
import { pickGroupMetadata } from '@/types/groups';
import type { Plan, Series } from '@/types/series';
import { appT } from '@/lib/tolgee';
import { checkGroupFollowed, checkGroupJoined } from '@/services/groups';
import { usePendingGroups } from '@/hooks/usePendingGroups';
import {
  isGroupOptimisticallyFollowed,
  isGroupOptimisticallyJoined,
} from '@/stores/pending-groups';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth0 } from 'react-native-auth0';
import { useGuest } from '@/providers/guest';
import { useQuery } from '@tanstack/react-query';
import { useTranslate } from '@tolgee/react';

export default function GroupProfileScreen() {
  const { t } = useTranslate();
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = id!;
  const insets = useSafeAreaInsets();
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const socialSheetRef = useRef<BottomSheetModal>(null);
  const { isDark } = useThemeColors();

  const { data: group, isLoading, error, refetch } = useGroupProfile(groupId);
  const joinMutation = useJoinGroup(groupId);
  const leaveMutation = useLeaveGroup(groupId);
  const followMutation = useFollowGroup(groupId);
  const unfollowMutation = useUnfollowGroup(groupId);

  const [tab, setTab] = useState<GroupProfileTab>('practices');

  const isPage = group?.group_type === 'PAGE';

  const { data: isMember, refetch: refetchMember } = useQuery({
    queryKey: ['groups', 'membership', groupId, isPage],
    queryFn: () => (isPage ? checkGroupFollowed(groupId) : checkGroupJoined(groupId)),
    enabled: !!group && !!user && !isGuest,
    retry: false,
  });

  const pending = usePendingGroups();

  const isActive = isPage
    ? isGroupOptimisticallyFollowed(groupId, isMember ?? false, pending)
    : isGroupOptimisticallyJoined(groupId, isMember ?? false, pending);

  const meta = group ? pickGroupMetadata(group.metadata, language) : undefined;
  const seriesList = useMemo(() => (group?.series ?? []) as Series[], [group]);
  const plansList = useMemo(() => (group?.plans ?? []) as Plan[], [group]);
  const socialLinks = group?.social_links ?? [];
  const shortDescription = meta?.description ?? '';
  const longDescription = meta?.description_long ?? '';
  const showAbout = !!longDescription.trim();

  useEffect(() => {
    if (!showAbout && tab === 'about') {
      setTab('practices');
    }
  }, [showAbout, tab]);

  const handleCta = async () => {
    if (isGuest || !user) {
      showLoginDrawer();
      return;
    }
    try {
      if (isActive) {
        if (isPage) await unfollowMutation.mutateAsync();
        else await leaveMutation.mutateAsync();
      } else {
        if (isPage) await followMutation.mutateAsync();
        else await joinMutation.mutateAsync();
      }
      refetchMember();
    } catch {
      Alert.alert(appT('something_went_wrong'));
    }
  };

  const handleLinksPress = (ordered: GroupSocialLink[]) => {
    if (ordered.length === 1) {
      void Linking.openURL(ordered[0].url);
      return;
    }
    socialSheetRef.current?.present();
  };

  const ctaPending =
    joinMutation.isPending ||
    leaveMutation.isPending ||
    followMutation.isPending ||
    unfollowMutation.isPending;

  const scaffoldClassName = cn('flex-1', isDark ? 'bg-black' : 'bg-[#FBF9F4]');

  if (isLoading) {
    return (
      <View className={scaffoldClassName} style={{ paddingTop: insets.top }}>
        <GroupProfileAppBar />
        <ActivityIndicator style={{ marginTop: 48 }} />
      </View>
    );
  }

  if (error || !group) {
    return (
      <View className={cn(scaffoldClassName, 'items-center justify-center')} style={{ paddingTop: insets.top }}>
        <Text className="text-destructive">{t('no_groups_found')}</Text>
        <Pressable onPress={() => refetch()} className="mt-3 active:opacity-70">
          <Text className="text-foreground">{t('retry')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className={scaffoldClassName} style={{ paddingTop: insets.top }}>
      <GroupProfileAppBar />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <GroupProfileBanner bannerUrl={group.banner_url} />
        <GroupProfileHeader group={group} meta={meta} language={language} />
        <GroupProfileDescription description={shortDescription} />
        <GroupProfileLinksRow links={socialLinks} onPress={handleLinksPress} />
        <GroupProfileJoinButton
          isActive={isActive}
          isPage={isPage}
          pending={ctaPending}
          onPress={() => void handleCta()}
        />
        <GroupProfileTabBar tab={tab} onTabChange={setTab} showAbout={showAbout} />
        {tab === 'practices' ? (
          <GroupProfilePracticesTab seriesList={seriesList} plansList={plansList} />
        ) : (
          <GroupProfileAboutTab content={longDescription} />
        )}
      </ScrollView>

      {socialLinks.length > 1 ? (
        <GroupSocialLinksSheet ref={socialSheetRef} links={socialLinks} />
      ) : null}

      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </View>
  );
}
