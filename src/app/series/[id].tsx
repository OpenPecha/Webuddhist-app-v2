import '@/lib/i18n';
import { useSeriesById } from '@/hooks/api/useSeries';
import { imageUrl } from '@/utils/image-url';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Plan } from '@/types/series';

function SectionLabel({ label }: { label: string }) {
  return (
    <Text style={{
      fontSize: 11, fontWeight: '600', fontFamily: 'Inter-SemiBold',
      letterSpacing: 1.0, color: '#8a8a8a', textTransform: 'uppercase',
    }}>
      {label}
    </Text>
  );
}

function PlanRow({
  plan,
  planIndex,
  totalPlans,
}: {
  plan: Plan;
  planIndex: number;
  totalPlans: number;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const daysLabel = plan.total_days === 1
    ? t('series.n_days_one')
    : t('series.n_days_other', { count: plan.total_days });

  return (
    <Pressable
      onPress={() => router.push(`/series/${plan.id}/plan`)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingBottom: 16,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      {/* Thumbnail */}
      <View style={{
        width: 80, height: 80, borderRadius: 10, overflow: 'hidden',
        backgroundColor: '#e8e8e4',
      }}>
        {plan.image ? (
          <Image
            source={{ uri: imageUrl(plan.image, 'thumbnail') }}
            style={{ width: 80, height: 80 }}
            contentFit="cover"
          />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#DEAD2D22', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="image-outline" size={24} color="rgba(255,255,255,0.5)" />
          </View>
        )}
      </View>

      {/* Details */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 11, color: '#DEAD2D', fontWeight: '600', fontFamily: 'Inter-SemiBold', letterSpacing: 0.3, marginBottom: 2 }}>
          Plan {planIndex + 1} of {totalPlans}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'Inter-SemiBold', color: '#000', lineHeight: 20 }} numberOfLines={2}>
          {plan.title}
        </Text>
        {plan.total_days > 0 && (
          <Text style={{ fontSize: 12, color: '#8a8a8a', marginTop: 4 }}>
            {daysLabel}
          </Text>
        )}
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={14} color="#8a8a8a" style={{ marginTop: 4 }} />
    </Pressable>
  );
}

export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: series, isLoading, error, refetch } = useSeriesById(id!);
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const metadata =
    series?.metadata.find((m) => m.language === 'EN') ?? series?.metadata[0];

  const sorted = series
    ? [...series.plans].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    : [];

  const nPlansLabel = sorted.length === 1
    ? t('series.n_plans_one')
    : t('series.n_plans_other', { count: sorted.length });

  const handleEnroll = () => {
    Alert.alert(
      t('series.enroll'),
      undefined,
      [{ text: 'OK' }],
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDFDFC' }}>
        {/* Minimal app bar while loading */}
        <View style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 8,
          paddingBottom: 4,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  if (error || !series) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDFDFC' }}>
        <View style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 8,
          paddingBottom: 4,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Text style={{ color: '#dc341e', textAlign: 'center' }}>Failed to load series</Text>
          <Pressable
            onPress={() => refetch()}
            style={{ borderRadius: 8, backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '500' }}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero image with back button overlay */}
        <View>
          <Image
            source={{ uri: imageUrl(series.image) }}
            style={{ width: '100%', aspectRatio: 16 / 9 }}
            contentFit="cover"
            transition={300}
          />
          {/* Gradient overlay */}
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 120,
            backgroundColor: 'rgba(0,0,0,0.25)',
          }} />
          {/* Back button */}
          <View style={{
            position: 'absolute',
            top: insets.top + 4,
            left: 4,
          }}>
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 40, height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.35)',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 4,
              }}
            >
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Title + meta */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000', marginBottom: 6 }}>
            {metadata?.title}
          </Text>
          <Text style={{ fontSize: 13, color: '#8a8a8a' }}>
            {nPlansLabel}
          </Text>
        </View>

        {/* About section */}
        {metadata?.description ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
            <SectionLabel label={t('series.about')} />
            <Text style={{ fontSize: 14, color: '#333', lineHeight: 22, marginTop: 8 }}>
              {metadata.description}
            </Text>
          </View>
        ) : null}

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: '#e8e8e4', marginTop: 24 }} />

        {/* About the creator — shown if first plan has author info */}
        {sorted.length > 0 && (series as any).author_name ? (
          <>
            <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 }}>
              <SectionLabel label={t('series.about_creator')} />
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 }}>
                {/* Avatar placeholder */}
                <View style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: '#e8e8e4',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ionicons name="person" size={24} color="#aaa" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'Inter-SemiBold', color: '#000' }}>
                    {(series as any).author_name}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#DEAD2D', marginTop: 16 }}>
                    {t('series.view_creator_page', { name: (series as any).author_name })}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: '#e8e8e4' }} />
          </>
        ) : null}

        {/* Included plans */}
        {sorted.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
            <SectionLabel label={t('series.included_plans')} />
            <View style={{ marginTop: 12 }}>
              {sorted.map((plan, index) => (
                <PlanRow
                  key={plan.id}
                  plan={plan}
                  planIndex={index}
                  totalPlans={sorted.length}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky enroll button */}
      <View style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        backgroundColor: '#FDFDFC',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: insets.bottom + 16,
        borderTopWidth: 1,
        borderTopColor: '#e8e8e4',
      }}>
        <Pressable
          onPress={handleEnroll}
          style={({ pressed }) => ({
            backgroundColor: '#000',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
            {t('series.enroll')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
