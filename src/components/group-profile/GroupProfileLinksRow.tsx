import { GP_PADDING, GP_SECONDARY_SIZE } from '@/components/group-profile/group-profile-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { displayHostUrl, orderGroupSocialLinks, type GroupSocialLink } from '@/lib/group-profile-format';
import { LinkSimple } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

interface GroupProfileLinksRowProps {
  links: GroupSocialLink[];
  onPress: (orderedLinks: GroupSocialLink[]) => void;
}

export function GroupProfileLinksRow({ links, onPress }: GroupProfileLinksRowProps) {
  const { t } = useTranslation();
  const { foreground, mutedForeground } = useThemeColors();

  if (links.length === 0) return null;

  const ordered = orderGroupSocialLinks(links);
  const primary = ordered[0];
  const moreCount = ordered.length - 1;
  const displayUrl = displayHostUrl(primary.url);

  return (
    <Pressable
      onPress={() => onPress(ordered)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: GP_PADDING,
        paddingTop: 12,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <LinkSimple size={18} color={mutedForeground} />
      <Text
        style={{ flex: 1, marginLeft: 6, fontSize: GP_SECONDARY_SIZE, lineHeight: 20 }}
        numberOfLines={1}
      >
        <Text style={{ color: foreground }}>{displayUrl}</Text>
        {moreCount > 0 ? (
          <Text style={{ color: mutedForeground }}>
            {` ${t('connect.and_more_links', { count: moreCount })}`}
          </Text>
        ) : null}
      </Text>
    </Pressable>
  );
}
