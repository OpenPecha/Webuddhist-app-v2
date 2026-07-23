import { CONNECT_AVATAR, CONNECT_PADDING } from '@/components/connect/connect-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { pickGroupMetadata } from '@/types/groups';
import type { AuthorGroupSummary } from '@/types/groups';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { FlatList, Pressable, View } from 'react-native';

interface MyGroupsSectionProps {
  groups: AuthorGroupSummary[];
  total?: number;
}

export function MyGroupsSection({ groups, total }: MyGroupsSectionProps) {
  const router = useRouter();
  const language = useContentLanguage();
  const { cardSurface, skeleton } = useThemeColors();

  if (groups.length === 0) return null;

  const showSeeAll = (total ?? groups.length) > 0;

  return (
    <View className="mb-2">
      <View className="flex-row items-center justify-between px-5 pb-3 pt-5">
        <Text className="flex-1 text-lg font-bold text-foreground">{"My groups"}</Text>
        {showSeeAll ? (
          <Pressable onPress={() => router.push('/connect/my-groups')}>
            <Text className="text-sm font-medium text-muted-foreground">{"See all"}</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        horizontal
        data={groups}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: CONNECT_PADDING, gap: 16 }}
        renderItem={({ item }) => {
          const meta = pickGroupMetadata(item.metadata, language);
          return (
            <Pressable
              onPress={() => router.push({ pathname: '/group/[id]', params: { id: item.id } })}
              className="w-20 items-center active:opacity-75"
            >
              <View
                className="mb-2 overflow-hidden rounded-2xl"
                style={{
                  width: CONNECT_AVATAR.tile,
                  height: CONNECT_AVATAR.tile,
                  backgroundColor: cardSurface,
                }}
              >
                {item.avatar_url ? (
                  <Image
                    source={{ uri: item.avatar_url }}
                    style={{ width: CONNECT_AVATAR.tile, height: CONNECT_AVATAR.tile }}
                    contentFit="cover"
                  />
                ) : (
                  <View className="flex-1" style={{ backgroundColor: skeleton }} />
                )}
              </View>
              <Text className="text-center text-xs font-medium text-muted-foreground" numberOfLines={1}>
                {meta?.title ?? item.slug}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
