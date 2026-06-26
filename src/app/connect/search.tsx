import '@/lib/i18n';
import { DiscoverGroupCard } from '@/components/connect/DiscoverGroupCard';
import { useDiscoverGroups } from '@/hooks/api/useDiscoverGroups';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GroupSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDiscoverGroups(debounced);

  const groups = data?.pages.flatMap((page) => page.groups) ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('connect.search_placeholder')}
          autoFocus
          style={{
            flex: 1,
            fontSize: 16,
            paddingVertical: 10,
            paddingHorizontal: 12,
            backgroundColor: '#f0f0ec',
            borderRadius: 10,
            marginRight: 12,
          }}
        />
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
              {t('connect.search_empty')}
            </Text>
          )
        }
        renderItem={({ item }) => <DiscoverGroupCard group={item} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
        }
      />
    </View>
  );
}
