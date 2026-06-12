import '@/lib/i18n';
import { FeaturedSeriesCard } from '@/components/series/FeaturedSeriesCard';
import { SeriesCard } from '@/components/series/SeriesCard';
import { useSeries } from '@/hooks/api/useSeries';
import { imageUrl } from '@/utils/image-url';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function buildGreeting(t: (key: string) => string): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('home.good_morning');
  if (hour < 17) return t('home.good_afternoon');
  return t('home.good_evening');
}

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 }}>
      <Text style={{
        fontSize: 12, fontWeight: '600', fontFamily: 'Inter-SemiBold',
        letterSpacing: 1.2, color: '#8a8a8a',
        textTransform: 'uppercase',
      }}>
        {label}
      </Text>
    </View>
  );
}

function ContinueTodayCard({ series }: { series: Parameters<typeof FeaturedSeriesCard>[0]['series'] }) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/series/${series.id}`)}
      style={({ pressed }) => ({
        flexDirection: 'row', borderRadius: 16, overflow: 'hidden',
        backgroundColor: '#f5f5f0', marginHorizontal: 16, marginBottom: 12,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Image
        source={{ uri: imageUrl(series.image) }}
        style={{ width: 100, height: 100 }}
        contentFit="cover"
      />
      <View style={{ flex: 1, padding: 12, justifyContent: 'center', gap: 4 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }} numberOfLines={2}>
          {series.metadata?.title}
        </Text>
        <Text style={{ fontSize: 13, color: '#DEAD2D', fontWeight: '600' }}>
          {t('home.series_in_progress')}
        </Text>
      </View>
    </Pressable>
  );
}

export default function Index() {
  const { user } = useAuth0();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const { data, isLoading, error, refetch } = useSeries();

  const seriesList = data?.series ?? [];
  const featured = seriesList.find((s) => s.featured) ?? seriesList[0];

  // Enrolled series come from a user-plans API (not yet wired); empty until available
  const enrolledSeries = useMemo(() => [] as typeof seriesList, []);

  const explore = useMemo(() => {
    const enrolledIds = new Set(enrolledSeries.map((s) => s.id));
    const rest = seriesList.filter(
      (s) => s.id !== featured?.id && !enrolledIds.has(s.id),
    );
    if (!query.trim()) return rest;
    return rest.filter((s) =>
      s.metadata?.title?.toLowerCase().includes(query.toLowerCase()),
    );
  }, [seriesList, featured, enrolledSeries, query]);

  const firstName = user?.given_name ?? user?.name?.split(' ')[0] ?? '';
  const greeting = firstName
    ? `${buildGreeting(t)}, ${firstName}`
    : buildGreeting(t);

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: '#FDFDFC' }}
      contentContainerStyle={{
        paddingTop: Platform.OS === 'android' ? insets.top : 12,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
      onRefresh={refetch}
      refreshing={isLoading}
      ListHeaderComponent={
        <View>
          {/* Greeting */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <Text style={{ fontSize: 26, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000' }}>
              {greeting}
            </Text>
          </View>

          {/* Search */}
          <View style={{
            marginHorizontal: 16, marginBottom: 8,
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: '#f0f0ec', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
          }}>
            <Text style={{ fontSize: 16, color: '#8a8a8a' }}>🔍</Text>
            <TextInput
              style={{ flex: 1, fontSize: 16, color: '#000', fontFamily: 'Inter-Regular' }}
              placeholder={t('home.search')}
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Loading / error */}
          {isLoading && !data && (
            <View style={{ height: 192, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" />
            </View>
          )}
          {error && (
            <View style={{ alignItems: 'center', gap: 8, paddingHorizontal: 16 }}>
              <Text style={{ color: '#dc341e', textAlign: 'center' }}>Failed to load series</Text>
              <Pressable
                onPress={() => refetch()}
                style={{ borderRadius: 8, backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 8 }}
              >
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '500' }}>Retry</Text>
              </Pressable>
            </View>
          )}

          {/* Continue today — enrolled series */}
          {enrolledSeries.length > 0 && (
            <>
              <SectionHeader label={t('home.continue_today')} />
              {enrolledSeries.map((s) => (
                <ContinueTodayCard key={s.id} series={s} />
              ))}
            </>
          )}

          {/* Featured — only if not in enrolled list and no search query */}
          {featured && !query && enrolledSeries.every((s) => s.id !== featured.id) && (
            <>
              <SectionHeader label={t('home.featured')} />
              <View style={{ paddingHorizontal: 16 }}>
                <FeaturedSeriesCard series={featured} />
              </View>
            </>
          )}

          {/* Explore more header */}
          {explore.length > 0 && (
            <SectionHeader label={t('home.explore_more')} />
          )}
        </View>
      }
      data={explore}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ gap: 8, paddingHorizontal: 16 }}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}>
          <SeriesCard series={item} />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      ListEmptyComponent={
        !isLoading && query ? (
          <View style={{ alignItems: 'center', paddingVertical: 32, paddingHorizontal: 16 }}>
            <Text style={{ color: '#8a8a8a', textAlign: 'center', fontFamily: 'Inter-Regular' }}>
              {t('home.no_series_found')} "{query}"
            </Text>
          </View>
        ) : null
      }
    />
  );
}
