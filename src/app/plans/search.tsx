import { AllPlansListSkeleton } from '@/components/practice/AllPlansListSkeleton';
import { PracticePlanListTile } from '@/components/practice/PracticePlanListTile';
import { useSeriesSearch } from '@/hooks/api/useSeriesSearch';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
  const { t } = useTranslation();
  const {
    foreground,
    mutedForeground,
    destructive,
    scaffoldBackground,
    surfaceInput,
    borderInput,
  } = useThemeColors();

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

  const { data, isLoading, isError, isFetching, refetch } = useSeriesSearch(debounced);
  const results = data?.series ?? [];
  const hasQuery = debounced.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 4,
          paddingRight: 16,
          paddingBottom: 12,
          gap: 4,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ padding: 12 }}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={22} color={foreground} />
        </Pressable>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            backgroundColor: surfaceInput,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: borderInput,
          }}
        >
          <MagnifyingGlass size={20} color={mutedForeground} style={{ marginRight: 8 }} />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder={t('plans.search_placeholder')}
            placeholderTextColor={mutedForeground}
            returnKeyType="search"
            style={{
              flex: 1,
              fontSize: 15,
              color: foreground,
              paddingVertical: 10,
            }}
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => {
                setQuery('');
                setDebounced('');
                inputRef.current?.focus();
              }}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={20} color={mutedForeground} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {!hasQuery ? null : isLoading || (isFetching && !data) ? (
        <AllPlansListSkeleton rows={4} />
      ) : isError ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            gap: 12,
          }}
        >
          <Text style={{ color: destructive, textAlign: 'center' }}>
            {t('plans.load_error')}
          </Text>
          <Pressable onPress={() => void refetch()} style={{ padding: 12 }}>
            <Text style={{ fontWeight: '600', fontFamily: 'Inter-SemiBold', color: foreground }}>
              {t('plans.retry')}
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: insets.bottom + 24,
            flexGrow: 1,
            gap: 12,
          }}
          ListEmptyComponent={
            <View style={{ paddingTop: 48, paddingHorizontal: 24 }}>
              <Text style={{ color: mutedForeground, textAlign: 'center', fontSize: 15 }}>
                {t('home.no_series_found')}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <PracticePlanListTile
              series={item}
              onPress={() => router.push(`/series/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}
