import { CONNECT_AVATAR, CONNECT_PADDING } from '@/components/connect/connect-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { pickGroupMetadata } from '@/types/groups';
import type { AuthorGroupSummary } from '@/types/groups';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { FlatList, Pressable, View } from 'react-native';

interface MyGroupsSectionProps {
  groups: AuthorGroupSummary[];
  total?: number;
}

export function MyGroupsSection({ groups, total }: MyGroupsSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const language = useContentLanguage();
  const { cardSurface, skeleton } = useThemeColors();

  if (groups.length === 0) return null;

  const showSeeAll = (total ?? groups.length) > 0;

  return (
    <View style={{ marginBottom: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: CONNECT_PADDING,
          paddingTop: 20,
          paddingBottom: 12,
        }}
      >
        <Text className="flex-1 text-lg font-bold text-foreground">{t('connect.my_groups')}</Text>
        {showSeeAll ? (
          <Pressable onPress={() => router.push('/connect/my-groups')}>
            <Text className="text-sm font-medium text-muted-foreground">{t('connect.see_all')}</Text>
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
              style={({ pressed }) => ({
                width: 80,
                alignItems: 'center',
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <View
                style={{
                  width: CONNECT_AVATAR.tile,
                  height: CONNECT_AVATAR.tile,
                  borderRadius: CONNECT_AVATAR.tileRadius,
                  overflow: 'hidden',
                  backgroundColor: cardSurface,
                  marginBottom: 8,
                }}
              >
                {item.avatar_url ? (
                  <Image
                    source={{ uri: item.avatar_url }}
                    style={{ width: CONNECT_AVATAR.tile, height: CONNECT_AVATAR.tile }}
                    contentFit="cover"
                  />
                ) : (
                  <View style={{ flex: 1, backgroundColor: skeleton }} />
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
