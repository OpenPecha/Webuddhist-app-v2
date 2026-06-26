import { useJoinedGroups } from '@/hooks/api/useDiscoverGroups';
import { pickGroupMetadata } from '@/types/groups';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useContentLanguage } from '@/hooks/useContentLanguage';

export function MyGroupsSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const language = useContentLanguage();
  const { data, isLoading } = useJoinedGroups();

  const groups = data?.groups ?? [];

  return (
    <View style={{ marginBottom: 24 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            letterSpacing: 1,
            color: '#8a8a8a',
            textTransform: 'uppercase',
          }}
        >
          {t('connect.my_groups')}
        </Text>
        {groups.length > 0 ? (
          <Pressable onPress={() => router.push('/connect/my-groups')}>
            <Text style={{ fontSize: 13, color: '#000', fontWeight: '600' }}>{t('connect.see_all')}</Text>
          </Pressable>
        ) : null}
      </View>

      {isLoading ? null : groups.length === 0 ? (
        <View style={{ marginHorizontal: 20, height: 120, backgroundColor: '#e8e8e4', borderRadius: 12 }} />
      ) : (
        <FlatList
          horizontal
          data={groups}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          renderItem={({ item }) => {
            const meta = pickGroupMetadata(item.metadata, language);
            return (
              <Pressable
                onPress={() => router.push({ pathname: '/group/[id]', params: { id: item.id } })}
                style={({ pressed }) => ({
                  width: 100,
                  alignItems: 'center',
                  opacity: pressed ? 0.75 : 1,
                })}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    overflow: 'hidden',
                    backgroundColor: '#e8e8e4',
                    marginBottom: 8,
                  }}
                >
                  {item.avatar_url ? (
                    <Image
                      source={{ uri: item.avatar_url }}
                      style={{ width: 64, height: 64 }}
                      contentFit="cover"
                    />
                  ) : null}
                </View>
                <Text style={{ fontSize: 12, textAlign: 'center', color: '#000' }} numberOfLines={2}>
                  {meta?.title ?? item.slug}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
