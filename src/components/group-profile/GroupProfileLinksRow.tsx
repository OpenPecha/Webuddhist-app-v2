import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { displayHostUrl, orderGroupSocialLinks, type GroupSocialLink } from '@/lib/group-profile-format';
import { LinkSimple } from 'phosphor-react-native';
import { Pressable } from 'react-native';

interface GroupProfileLinksRowProps {
  links: GroupSocialLink[];
  onPress: (orderedLinks: GroupSocialLink[]) => void;
}

export function GroupProfileLinksRow({ links, onPress }: GroupProfileLinksRowProps) {
  const { mutedForeground } = useThemeColors();

  if (links.length === 0) return null;

  const ordered = orderGroupSocialLinks(links);
  const primary = ordered[0];
  const moreCount = ordered.length - 1;
  const displayUrl = displayHostUrl(primary.url);

  return (
    <Pressable
      onPress={() => onPress(ordered)}
      className="flex-row items-center px-4 pt-3 active:opacity-75"
    >
      <LinkSimple size={18} color={mutedForeground} />
      <Text className="ml-1.5 flex-1 text-sm leading-5" numberOfLines={1}>
        <Text className="text-foreground">{displayUrl}</Text>
        {moreCount > 0 ? (
          <Text className="text-muted-foreground">
            {` and ${moreCount} more links`}
          </Text>
        ) : null}
      </Text>
    </Pressable>
  );
}
