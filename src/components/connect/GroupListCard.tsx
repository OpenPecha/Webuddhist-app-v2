import { CONNECT_AVATAR } from '@/components/connect/connect-styles';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { groupCardSubtitle } from '@/lib/connect-groups';
import { pickGroupMetadata } from '@/types/groups';
import type { AuthorGroupSummary } from '@/types/groups';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { useUiLanguage } from '@/lib/i18n';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

interface GroupListCardProps {
  group: AuthorGroupSummary;
  showChevron?: boolean;
}

export function GroupListCard({ group, showChevron = false }: GroupListCardProps) {
  const router = useRouter();
  const language = useContentLanguage();
  const { t } = useTranslate();
  const uiLanguage = useUiLanguage();
  const { mutedForeground, cardSurface, cardBorder, skeleton } = useThemeColors();

  const meta = pickGroupMetadata(group.metadata, language);
  const subtitle = groupCardSubtitle(
    group,
    meta,
    t('group_member'),
    t('group_members'),
    uiLanguage,
  );

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/group/[id]', params: { id: group.id } })}
      className="mb-3 flex-row items-center rounded-2xl border p-3 active:opacity-85"
      style={{ backgroundColor: cardSurface, borderColor: cardBorder }}
    >
      <View
        className="h-12 w-12 overflow-hidden rounded-full"
        style={{ backgroundColor: skeleton }}
      >
        {group.avatar_url ? (
          <Image
            source={{ uri: group.avatar_url }}
            style={{ width: CONNECT_AVATAR.discover, height: CONNECT_AVATAR.discover }}
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
      {showChevron ? (
        <Ionicons name="chevron-forward" size={16} color={mutedForeground} />
      ) : null}
    </Pressable>
  );
}
