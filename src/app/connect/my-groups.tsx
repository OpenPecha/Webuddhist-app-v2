import '@/lib/i18n';
import { DiscoverGroupCard } from '@/components/connect/DiscoverGroupCard';
import { useJoinedGroups } from '@/hooks/api/useDiscoverGroups';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyGroupsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, isLoading } = useJoinedGroups(0, 50);

  const groups = data?.groups ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 17, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
          {t('connect.my_groups')}
        </Text>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={{ marginTop: 48 }} />
          ) : (
            <Text style={{ textAlign: 'center', color: '#8a8a8a', marginTop: 48 }}>
              {t('connect.my_groups_empty')}
            </Text>
          )
        }
        renderItem={({ item }) => <DiscoverGroupCard group={item} isJoined />}
      />
    </View>
  );
}
