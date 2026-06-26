import { pickGroupMetadata } from '@/types/groups';
import type { AuthorGroupSummary } from '@/types/groups';
import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { useJoinGroup } from '@/hooks/api/useDiscoverGroups';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useGuest } from '@/providers/guest';
import {
  getPendingGroupsSnapshot,
  isGroupOptimisticallyJoined,
  subscribePendingGroups,
} from '@/stores/pending-groups';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

interface DiscoverGroupCardProps {
  group: AuthorGroupSummary;
  isJoined?: boolean;
}

export function DiscoverGroupCard({ group, isJoined = false }: DiscoverGroupCardProps) {
  const router = useRouter();
  const language = useContentLanguage();
  const { t } = useTranslation();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const joinMutation = useJoinGroup(group.id);

  useSyncExternalStore(subscribePendingGroups, getPendingGroupsSnapshot);

  const meta = pickGroupMetadata(group.metadata, language);
  const joined = isGroupOptimisticallyJoined(group.id, isJoined);

  const handleJoin = () => {
    if (isGuest || !user) {
      showLoginDrawer();
      return;
    }
    joinMutation.mutate();
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#e8e8e4',
        }}
      >
        <Pressable
          onPress={() => router.push({ pathname: '/group/[id]', params: { id: group.id } })}
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              overflow: 'hidden',
              backgroundColor: '#e8e8e4',
            }}
          >
            {group.avatar_url ? (
              <Image source={{ uri: group.avatar_url }} style={{ width: 56, height: 56 }} contentFit="cover" />
            ) : null}
          </View>
          <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
            <Text
              style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold', color: '#000' }}
              numberOfLines={1}
            >
              {meta?.title ?? group.slug}
            </Text>
            {meta?.sub_title ? (
              <Text style={{ fontSize: 13, color: '#8a8a8a', marginTop: 2 }} numberOfLines={1}>
                {meta.sub_title}
              </Text>
            ) : null}
            {group.member_count != null ? (
              <Text style={{ fontSize: 12, color: '#8a8a8a', marginTop: 4 }}>
                {t('connect.members_count', { count: group.member_count })}
              </Text>
            ) : null}
          </View>
        </Pressable>
        <Pressable
          onPress={joined ? undefined : handleJoin}
          disabled={joined || joinMutation.isPending}
          style={({ pressed }) => ({
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: joined ? '#f0f0ec' : '#000',
            opacity: pressed ? 0.75 : 1,
            minWidth: 72,
            alignItems: 'center',
          })}
        >
          {joinMutation.isPending ? (
            <ActivityIndicator size="small" color={joined ? '#000' : '#fff'} />
          ) : (
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: joined ? '#000' : '#fff',
              }}
            >
              {joined ? t('connect.joined') : t('connect.join')}
            </Text>
          )}
        </Pressable>
      </View>
      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </>
  );
}
