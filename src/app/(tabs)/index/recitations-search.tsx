import { RecitationListTile } from '@/components/recitation/RecitationListTile';
import { RecitationsListSkeleton } from '@/components/recitation/RecitationsListSkeleton';
import { Text } from '@/components/ui/text';
import { useRecitations } from '@/hooks/api/useRecitations';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RecitationsSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslate();
  const { foreground, mutedForeground } = useThemeColors();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(focusTimer);
  }, []);

  const { data, isLoading, isError, refetch } = useRecitations();
  const recitations = data?.recitations ?? [];
  const hasQuery = debounced.length > 0;

  const results = useMemo(() => {
    if (!hasQuery) return [];
    const q = debounced.toLowerCase();
    return recitations.filter((item) => item.title.toLowerCase().includes(q));
  }, [recitations, debounced, hasQuery]);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-1 pb-3 pl-1 pr-4">
        <Pressable
          onPress={() => router.back()}
          className="p-3 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('back')}
        >
          <Ionicons name="chevron-back" size={22} color={foreground} />
        </Pressable>
        <View className="flex-1 flex-row items-center rounded-full border border-border-input bg-surface-input px-3">
          <MagnifyingGlass size={20} color={mutedForeground} style={{ marginRight: 8 }} />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder={t('recitations_search')}
            placeholderTextColor={mutedForeground}
            returnKeyType="search"
            className="flex-1 py-2.5 text-[15px] text-foreground"
            accessibilityLabel={t('recitations_search')}
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => {
                setQuery('');
                setDebounced('');
                inputRef.current?.focus();
              }}
              hitSlop={8}
              className="active:opacity-70"
            >
              <Ionicons name="close-circle" size={20} color={mutedForeground} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {!hasQuery ? null : isLoading ? (
        <RecitationsListSkeleton rows={4} />
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 p-6">
          <Text className="text-center text-destructive">{t('recitations_load_error')}</Text>
          <Pressable onPress={() => void refetch()} className="p-3 active:opacity-70">
            <Text className="font-semibold text-foreground">{t('retry')}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.text_id}
          contentContainerClassName="grow pt-2"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          ListEmptyComponent={
            <View className="px-6 pt-12">
              <Text className="text-center text-[15px] text-muted-foreground">
                {t('recitations_no_found')}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <RecitationListTile
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/reader/[textId]',
                  params: { textId: item.text_id },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}
