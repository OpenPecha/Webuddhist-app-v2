import { CONNECT_AVATAR, CONNECT_CARD, CONNECT_JOIN_BUTTON } from '@/components/connect/connect-styles';
import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { useJoinGroup, useFollowGroup } from '@/hooks/api/useDiscoverGroups';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
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
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
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
    t('connect.member'),
    t('connect.members'),
    i18n.language,
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
      ? t('connect.following')
      : t('connect.joined')
    : isPage
      ? t('connect.follow')
      : t('connect.join');

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: CONNECT_CARD.padding,
          marginBottom: CONNECT_CARD.gap,
          borderRadius: CONNECT_CARD.borderRadius,
          backgroundColor: cardSurface,
          borderWidth: 1,
          borderColor: cardBorder,
        }}
      >
        <Pressable
          onPress={() => router.push({ pathname: '/group/[id]', params: { id: group.id } })}
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View
            style={{
              width: CONNECT_AVATAR.discover,
              height: CONNECT_AVATAR.discover,
              borderRadius: CONNECT_AVATAR.discover / 2,
              overflow: 'hidden',
              backgroundColor: skeleton,
            }}
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
          <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
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
          style={({ pressed }) => ({
            height: CONNECT_JOIN_BUTTON.height,
            paddingHorizontal: CONNECT_JOIN_BUTTON.paddingHorizontal,
            borderRadius: CONNECT_JOIN_BUTTON.borderRadius,
            backgroundColor: active ? skeleton : shortcutCard,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: pressed ? 0.75 : 1,
            minWidth: 72,
          })}
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
