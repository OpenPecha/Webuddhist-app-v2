import {
  GP_AVATAR_SIZE,
  GP_PADDING,
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
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

interface GroupProfileHeaderProps {
  group: PublicGroupDetail;
  meta?: GroupMetadata;
  language: string;
}

export function GroupProfileHeader({ group, meta, language }: GroupProfileHeaderProps) {
  const { t, i18n } = useTranslation();
  const { mutedForeground, skeleton } = useThemeColors();

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
          <Text className="ml-3 flex-1 text-lg font-bold leading-6 text-foreground" numberOfLines={2}>
            {title}
          </Text>
        ) : null}
      </View>

      {meta?.sub_title ? (
        <Text className="mt-2 text-sm leading-5 text-muted-foreground">{meta.sub_title}</Text>
      ) : (
        <View style={{ height: 8 }} />
      )}

      <Text className="mt-1 text-sm leading-5 text-foreground">
        <Text className="font-bold">{formattedCount}</Text>
        {` ${countLabel}`}
      </Text>
    </View>
  );
}
