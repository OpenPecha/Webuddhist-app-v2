import { AllPlansListSkeleton } from '@/components/practice/AllPlansListSkeleton';
import { PracticePlanListTile } from '@/components/practice/PracticePlanListTile';
import { useSeriesSearch } from '@/hooks/api/useSeriesSearch';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlansSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslate();
  const { foreground, mutedForeground } = useThemeColors();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(focusTimer);
  }, []);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useSeriesSearch(debounced);

  const results = useMemo(
    () => data?.pages.flatMap((page) => page.series) ?? [],
    [data],
  );
  const hasQuery = debounced.length > 0;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-1 pb-3 pl-1 pr-4">
        <Pressable
          onPress={() => router.back()}
          className="p-3 active:opacity-70"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={22} color={foreground} />
        </Pressable>
        <View className="flex-1 flex-row items-center rounded-full border border-border-input bg-surface-input px-3">
          <MagnifyingGlass size={20} color={mutedForeground} style={{ marginRight: 8 }} />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder={t('search_plans')}
            placeholderTextColor={mutedForeground}
            returnKeyType="search"
            className="flex-1 py-2.5 text-[15px] text-foreground"
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

      {!hasQuery ? null : isLoading || (isFetching && !data) ? (
        <AllPlansListSkeleton rows={4} />
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 p-6">
          <Text className="text-center text-destructive">{t('session_plans_load_error')}</Text>
          <Pressable onPress={() => void refetch()} className="p-3 active:opacity-70">
            <Text className="font-semibold text-foreground">{t('retry')}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerClassName="grow gap-3 px-4 pt-2 pb-6"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          ListEmptyComponent={
            <View className="px-6 pt-12">
              <Text className="text-center text-[15px] text-muted-foreground">
                {t('home_no_series_found')}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <PracticePlanListTile
              series={item}
              onPress={() => router.push(`/series/${item.id}`)}
            />
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator className="my-4" /> : null
          }
        />
      )}
    </View>
  );
}
