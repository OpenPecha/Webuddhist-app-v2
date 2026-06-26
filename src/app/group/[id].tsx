import '@/lib/i18n';
import { MarkdownText } from '@/components/common/MarkdownText';
import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { GroupSocialLinksSheet } from '@/components/connect/GroupSocialLinksSheet';
import {
  useGroupProfile,
  useJoinGroup,
  useLeaveGroup,
  useFollowGroup,
  useUnfollowGroup,
} from '@/hooks/api/useDiscoverGroups';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { pickGroupMetadata } from '@/types/groups';
import { pickSeriesMetadata } from '@/types/series';
import type { Plan, Series } from '@/types/series';
import { imageUrl } from '@/utils/image-url';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth0 } from 'react-native-auth0';
import { useGuest } from '@/providers/guest';
import { checkGroupFollowed, checkGroupJoined } from '@/services/groups';
import { useQuery } from '@tanstack/react-query';

const DESCRIPTION_CLAMP_LINES = 6;

export default function GroupProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = id!;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const socialSheetRef = useRef<BottomSheetModal>(null);

  const { data: group, isLoading, error, refetch } = useGroupProfile(groupId);
  const joinMutation = useJoinGroup(groupId);
  const leaveMutation = useLeaveGroup(groupId);
  const followMutation = useFollowGroup(groupId);
  const unfollowMutation = useUnfollowGroup(groupId);

  const [tab, setTab] = useState<'practices' | 'about'>('practices');
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const isPage = group?.group_type === 'PAGE';

  const { data: isMember, refetch: refetchMember } = useQuery({
    queryKey: ['groups', 'membership', groupId, isPage],
    queryFn: () => (isPage ? checkGroupFollowed(groupId) : checkGroupJoined(groupId)),
    enabled: !!group && !!user && !isGuest,
  });

  const meta = group ? pickGroupMetadata(group.metadata, language) : undefined;

  const seriesList = useMemo(() => (group?.series ?? []) as Series[], [group]);
  const plansList = useMemo(() => (group?.plans ?? []) as Plan[], [group]);

  const socialLinks = group?.social_links ?? [];
  const shortDescription = meta?.description ?? '';
  const longDescription = meta?.description_long ?? meta?.description ?? '';

  const handleCta = async () => {
    if (isGuest || !user) {
      showLoginDrawer();
      return;
    }
    try {
      if (isMember) {
        if (isPage) await unfollowMutation.mutateAsync();
        else await leaveMutation.mutateAsync();
      } else {
        if (isPage) await followMutation.mutateAsync();
        else await joinMutation.mutateAsync();
      }
      refetchMember();
    } catch {
      Alert.alert(t('connect.action_error'));
    }
  };

  const handleSocialPress = () => {
    if (socialLinks.length === 1) {
      void Linking.openURL(socialLinks[0].url);
      return;
    }
    socialSheetRef.current?.present();
  };

  const ctaPending =
    joinMutation.isPending ||
    leaveMutation.isPending ||
    followMutation.isPending ||
    unfollowMutation.isPending;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
        <Pressable onPress={() => router.back()} style={{ padding: 16 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <ActivityIndicator style={{ marginTop: 48 }} />
      </View>
    );
  }

  if (error || !group) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FDFDFC',
          paddingTop: insets.top,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#dc341e' }}>{t('connect.not_found')}</Text>
        <Pressable onPress={() => refetch()} style={{ marginTop: 12 }}>
          <Text>{t('practice.retry')}</Text>
        </Pressable>
      </View>
    );
  }

  const followerLabel =
    group.follower_count != null
      ? t('connect.followers_count', { count: group.follower_count })
      : null;
  const memberLabel =
    group.joiner_count != null ? t('connect.members_count', { count: group.joiner_count }) : null;

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View>
          {group.banner_url ? (
            <Image
              source={{ uri: group.banner_url }}
              style={{ width: '100%', height: 160 }}
              contentFit="cover"
            />
          ) : (
            <View style={{ width: '100%', height: 160, backgroundColor: '#e8e8e4' }} />
          )}
          <Pressable
            onPress={() => router.back()}
            style={{ position: 'absolute', top: insets.top + 8, left: 8, padding: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <View style={{ marginTop: -32, paddingHorizontal: 20 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                borderWidth: 3,
                borderColor: '#FDFDFC',
                overflow: 'hidden',
                backgroundColor: '#e8e8e4',
              }}
            >
              {group.avatar_url ? (
                <Image source={{ uri: group.avatar_url }} style={{ width: 66, height: 66 }} contentFit="cover" />
              ) : null}
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000' }}>
            {meta?.title ?? group.slug}
          </Text>
          <Text style={{ fontSize: 13, color: '#8a8a8a', marginTop: 4 }}>
            {[followerLabel, memberLabel].filter(Boolean).join(' · ')}
          </Text>

          {shortDescription ? (
            <Pressable
              onPress={() => setDescriptionExpanded((v) => !v)}
              style={{ marginTop: 12 }}
            >
              <Text
                style={{ fontSize: 14, color: '#333', lineHeight: 20 }}
                numberOfLines={descriptionExpanded ? undefined : DESCRIPTION_CLAMP_LINES}
              >
                {shortDescription}
              </Text>
              {shortDescription.length > 120 ? (
                <Text style={{ fontSize: 13, color: '#000', fontWeight: '600', marginTop: 4 }}>
                  {descriptionExpanded ? t('connect.show_less') : t('connect.show_more')}
                </Text>
              ) : null}
            </Pressable>
          ) : null}

          {socialLinks.length > 0 ? (
            <Pressable
              onPress={handleSocialPress}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 16,
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <Ionicons name="link-outline" size={18} color="#000" />
              <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600' }}>
                {t('connect.social_links')}
              </Text>
              {socialLinks.length > 1 ? (
                <Text style={{ marginLeft: 6, fontSize: 13, color: '#8a8a8a' }}>
                  ({socialLinks.length})
                </Text>
              ) : null}
            </Pressable>
          ) : null}
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            marginHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#e8e8e4',
          }}
        >
          {(['practices', 'about'] as const).map((key) => (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderBottomWidth: 2,
                borderBottomColor: tab === key ? '#000' : 'transparent',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  fontFamily: 'Inter-SemiBold',
                  color: tab === key ? '#000' : '#8a8a8a',
                }}
              >
                {t(`connect.tab_${key}`)}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === 'practices' ? (
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            {seriesList.length === 0 && plansList.length === 0 ? (
              <Text style={{ color: '#8a8a8a', textAlign: 'center', marginTop: 24 }}>
                {t('connect.no_practices')}
              </Text>
            ) : (
              <>
                {seriesList.map((series) => {
                  const seriesMeta = pickSeriesMetadata(
                    Array.isArray(series.metadata) ? series.metadata : [series.metadata],
                    language,
                  );
                  return (
                    <Pressable
                      key={series.id}
                      onPress={() => router.push(`/series/${series.id}`)}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 12,
                        opacity: pressed ? 0.75 : 1,
                      })}
                    >
                      <Image
                        source={{ uri: imageUrl(series.image, 'thumbnail') }}
                        style={{ width: 64, height: 64, borderRadius: 8 }}
                        contentFit="cover"
                      />
                      <Text
                        style={{
                          flex: 1,
                          marginLeft: 12,
                          fontSize: 15,
                          fontWeight: '600',
                          fontFamily: 'Inter-SemiBold',
                        }}
                        numberOfLines={2}
                      >
                        {seriesMeta?.title ?? series.id}
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color="#8a8a8a" />
                    </Pressable>
                  );
                })}
                {plansList.map((plan) => (
                  <Pressable
                    key={plan.id}
                    onPress={() => router.push(`/plans/${plan.id}`)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      opacity: pressed ? 0.75 : 1,
                    })}
                  >
                    <Image
                      source={{ uri: imageUrl(plan.image, 'thumbnail') }}
                      style={{ width: 64, height: 64, borderRadius: 8 }}
                      contentFit="cover"
                    />
                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 12,
                        fontSize: 15,
                        fontWeight: '600',
                        fontFamily: 'Inter-SemiBold',
                      }}
                      numberOfLines={2}
                    >
                      {plan.title}
                    </Text>
                    <Ionicons name="chevron-forward" size={14} color="#8a8a8a" />
                  </Pressable>
                ))}
              </>
            )}
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            {longDescription ? (
              <MarkdownText content={longDescription} />
            ) : (
              <Text style={{ color: '#8a8a8a', textAlign: 'center', marginTop: 24 }}>
                {t('connect.no_about')}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FDFDFC',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: '#e8e8e4',
        }}
      >
        <Pressable
          onPress={handleCta}
          disabled={ctaPending}
          style={({ pressed }) => ({
            backgroundColor: isMember ? '#f0f0ec' : '#000',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: pressed || ctaPending ? 0.75 : 1,
          })}
        >
          <Text
            style={{
              color: isMember ? '#000' : '#fff',
              fontSize: 16,
              fontWeight: '600',
              fontFamily: 'Inter-SemiBold',
            }}
          >
            {isMember
              ? isPage
                ? t('connect.following')
                : t('connect.joined')
              : isPage
                ? t('connect.follow')
                : t('connect.join')}
          </Text>
        </Pressable>
      </View>

      {socialLinks.length > 1 ? (
        <GroupSocialLinksSheet ref={socialSheetRef} links={socialLinks} />
      ) : null}

      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </View>
  );
}
