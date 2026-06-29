import {
  GP_AVATAR_SIZE,
  GP_PADDING,
  GP_SECONDARY_SIZE,
  GP_TITLE_SIZE,
} from '@/components/group-profile/group-profile-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  formatMemberCountNumber,
  getGroupMemberCount,
  getMemberCountLabel,
} from '@/lib/group-profile-format';
import type { GroupMetadata } from '@/types/groups';
import type { PublicGroupDetail } from '@/types/groups';
import { Image } from 'expo-image';
import { UsersThree } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

interface GroupProfileHeaderProps {
  group: PublicGroupDetail;
  meta?: GroupMetadata;
  language: string;
}

export function GroupProfileHeader({ group, meta, language }: GroupProfileHeaderProps) {
  const { t, i18n } = useTranslation();
  const { foreground, mutedForeground, skeleton } = useThemeColors();

  const isPage = group.group_type === 'PAGE';
  const count = getGroupMemberCount(group);
  const formattedCount = formatMemberCountNumber(count, i18n.language || language);
  const countLabel = getMemberCountLabel(count, isPage, t);
  const title = meta?.title ?? group.slug;

  return (
    <View style={{ paddingHorizontal: GP_PADDING, paddingTop: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: GP_AVATAR_SIZE,
            height: GP_AVATAR_SIZE,
            borderRadius: GP_AVATAR_SIZE / 2,
            overflow: 'hidden',
            backgroundColor: skeleton,
          }}
        >
          {group.avatar_url ? (
            <Image
              source={{ uri: group.avatar_url }}
              style={{ width: GP_AVATAR_SIZE, height: GP_AVATAR_SIZE }}
              contentFit="cover"
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <UsersThree size={22} color={mutedForeground} />
            </View>
          )}
        </View>
        {title ? (
          <Text
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: GP_TITLE_SIZE,
              fontWeight: '700',
              fontFamily: 'Inter-Bold',
              color: foreground,
              lineHeight: 24,
            }}
            numberOfLines={2}
          >
            {title}
          </Text>
        ) : null}
      </View>

      {meta?.sub_title ? (
        <Text
          style={{
            marginTop: 8,
            fontSize: GP_SECONDARY_SIZE,
            color: mutedForeground,
            lineHeight: 20,
          }}
        >
          {meta.sub_title}
        </Text>
      ) : (
        <View style={{ height: 8 }} />
      )}

      <Text style={{ marginTop: 4, fontSize: GP_SECONDARY_SIZE, color: foreground, lineHeight: 20 }}>
        <Text style={{ fontWeight: '700', fontFamily: 'Inter-Bold' }}>{formattedCount}</Text>
        {` ${countLabel}`}
      </Text>
    </View>
  );
}
