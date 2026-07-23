import { CONNECT_AVATAR, CONNECT_JOIN_BUTTON } from '@/components/connect/connect-styles';
import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { useJoinGroup, useFollowGroup } from '@/hooks/api/useDiscoverGroups';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppLanguage } from '@/lib/tolgee';
import { groupCardSubtitle } from '@/lib/connect-groups';
import { useGuest } from '@/providers/guest';
import { pickGroupMetadata } from '@/types/groups';
import type { AuthorGroupSummary } from '@/types/groups';
import { usePendingGroups } from '@/hooks/usePendingGroups';
import {
  isGroupOptimisticallyFollowed,
  isGroupOptimisticallyJoined,
} from '@/stores/pending-groups';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

interface DiscoverGroupCardProps {
  group: AuthorGroupSummary;
  isJoined?: boolean;
  isFollowed?: boolean;
}

export function DiscoverGroupCard({
  group,
  isJoined = false,
  isFollowed = false,
}: DiscoverGroupCardProps) {
  const router = useRouter();
  const language = useContentLanguage();
  const uiLanguage = useAppLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const { foreground, cardSurface, cardBorder, skeleton, shortcutCard } = useThemeColors();

  const isPage = group.group_type === 'PAGE';
  const joinMutation = useJoinGroup(group.id, group);
  const followMutation = useFollowGroup(group.id);
  const actionPending = isPage ? followMutation.isPending : joinMutation.isPending;

  const pending = usePendingGroups();

  const meta = pickGroupMetadata(group.metadata, language);
  const active = isPage
    ? isGroupOptimisticallyFollowed(group.id, isFollowed, pending)
    : isGroupOptimisticallyJoined(group.id, isJoined, pending);

  const subtitle = groupCardSubtitle(
    group,
    meta,
    "member",
    "members",
    uiLanguage,
  );

  const handleCta = () => {
    if (isGuest || !user) {
      showLoginDrawer();
      return;
    }
    if (isPage) followMutation.mutate();
    else joinMutation.mutate();
  };

  const ctaLabel = active
    ? isPage
      ? "Following"
      : "Joined"
    : isPage
      ? "Follow"
      : "Join";

  return (
    <>
      <View
        className="mb-3 flex-row items-center rounded-2xl border p-3"
        style={{ backgroundColor: cardSurface, borderColor: cardBorder }}
      >
        <Pressable
          onPress={() => router.push({ pathname: '/group/[id]', params: { id: group.id } })}
          className="flex-1 flex-row items-center active:opacity-85"
        >
          <View
            className="h-12 w-12 overflow-hidden rounded-full"
            style={{ backgroundColor: skeleton }}
          >
            {group.avatar_url ? (
              <Image
                source={{ uri: group.avatar_url }}
                style={{
                  width: CONNECT_AVATAR.discover,
                  height: CONNECT_AVATAR.discover,
                }}
                contentFit="cover"
              />
            ) : null}
          </View>
          <View className="ml-3 mr-2 flex-1">
            <Text className="text-[15px] font-bold leading-5 text-foreground" numberOfLines={2}>
              {meta?.title ?? group.slug}
            </Text>
            <Text className="mt-1 text-[13px] text-muted-foreground" numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={active ? undefined : handleCta}
          disabled={active || actionPending}
          className="min-w-[72px] items-center justify-center rounded-2xl active:opacity-75"
          style={{
            height: CONNECT_JOIN_BUTTON.height,
            paddingHorizontal: CONNECT_JOIN_BUTTON.paddingHorizontal,
            backgroundColor: active ? skeleton : shortcutCard,
          }}
        >
          {actionPending ? (
            <ActivityIndicator size="small" color={foreground} />
          ) : (
            <Text className="text-[13px] font-semibold text-foreground">{ctaLabel}</Text>
          )}
        </Pressable>
      </View>
      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </>
  );
}
