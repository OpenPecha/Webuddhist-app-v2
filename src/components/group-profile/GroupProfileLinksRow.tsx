import { GP_PADDING } from '@/components/group-profile/group-profile-styles';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { displayHostUrl, orderGroupSocialLinks, type GroupSocialLink } from '@/lib/group-profile-format';
import { LinkSimple } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

interface GroupProfileLinksRowProps {
  links: GroupSocialLink[];
  onPress: (orderedLinks: GroupSocialLink[]) => void;
}

export function GroupProfileLinksRow({ links, onPress }: GroupProfileLinksRowProps) {
  const { t } = useTranslation();
  const { mutedForeground } = useThemeColors();

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
      <Text className="ml-1.5 flex-1 text-sm leading-5" numberOfLines={1}>
        <Text className="text-foreground">{displayUrl}</Text>
        {moreCount > 0 ? (
          <Text className="text-muted-foreground">
            {` ${t('connect.and_more_links', { count: moreCount })}`}
          </Text>
        ) : null}
      </Text>
    </Pressable>
  );
}
