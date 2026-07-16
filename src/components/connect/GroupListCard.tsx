import { CONNECT_AVATAR, CONNECT_CARD } from '@/components/connect/connect-styles';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { groupCardSubtitle } from '@/lib/connect-groups';
import { pickGroupMetadata } from '@/types/groups';
import type { AuthorGroupSummary } from '@/types/groups';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

interface GroupListCardProps {
  group: AuthorGroupSummary;
  showChevron?: boolean;
}

export function GroupListCard({ group, showChevron = false }: GroupListCardProps) {
  const router = useRouter();
  const language = useContentLanguage();
  const { t, i18n } = useTranslation();
  const { mutedForeground, cardSurface, cardBorder, skeleton } = useThemeColors();

  const meta = pickGroupMetadata(group.metadata, language);
  const subtitle = groupCardSubtitle(
    group,
    meta,
    t('connect.member'),
    t('connect.members'),
    i18n.language,
  );

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/group/[id]', params: { id: group.id } })}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        padding: CONNECT_CARD.padding,
        marginBottom: CONNECT_CARD.gap,
        borderRadius: CONNECT_CARD.borderRadius,
        backgroundColor: cardSurface,
        borderWidth: 1,
        borderColor: cardBorder,
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
            style={{ width: CONNECT_AVATAR.discover, height: CONNECT_AVATAR.discover }}
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
      {showChevron ? (
        <Ionicons name="chevron-forward" size={16} color={mutedForeground} />
      ) : null}
    </Pressable>
  );
}
