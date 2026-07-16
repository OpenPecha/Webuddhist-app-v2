import { Text } from '@/components/ui/text';
import type { AuthorGroupSummary } from '@/types/groups';
import { pickGroupMetadata } from '@/types/groups';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

interface SeriesGroupRowProps {
  group: AuthorGroupSummary;
}

export function SeriesGroupRow({ group }: SeriesGroupRowProps) {
  const router = useRouter();
  const language = useContentLanguage();
  const meta = pickGroupMetadata(group.metadata, language);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/group/[id]', params: { id: group.id } })}
      style={({ pressed }) => ({
        marginHorizontal: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e8e8e4',
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#e8e8e4',
        }}
      >
        {group.avatar_url ? (
          <Image source={{ uri: group.avatar_url }} style={{ width: 40, height: 40 }} contentFit="cover" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="people-outline" size={20} color="#8a8a8a" />
          </View>
        )}
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        {meta?.title ? (
          <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
            {meta.title}
          </Text>
        ) : null}
        {meta?.sub_title ? (
          <Text className="mt-0.5 text-[13px] text-muted-foreground" numberOfLines={1}>
            {meta.sub_title}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={14} color="#8a8a8a" />
    </Pressable>
  );
}
