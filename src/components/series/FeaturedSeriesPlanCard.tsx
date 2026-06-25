import { SeriesStatsRow } from '@/components/series/SeriesPlanRow';
import type { Plan, SeriesDetail, SeriesMetadata } from '@/types/series';
import { imageUrl } from '@/utils/image-url';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface FeaturedSeriesPlanCardProps {
  series: SeriesDetail;
  featuredPlan: Plan;
  metadata?: SeriesMetadata;
  isEnrolled: boolean;
  isEnrollmentLoading?: boolean;
  isEnrolling: boolean;
  onEnroll: () => void;
  seriesId: string;
}

export function FeaturedSeriesPlanCard({
  series,
  featuredPlan,
  metadata,
  isEnrolled,
  isEnrollmentLoading = false,
  isEnrolling,
  onEnroll,
  seriesId,
}: FeaturedSeriesPlanCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const subtitle = metadata?.sub_title?.trim() || featuredPlan.description;
  const showEnroll = !isEnrolled && !isEnrollmentLoading;

  const openInfo = () => router.push(`/series/${seriesId}/info`);

  return (
    <View
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      <Pressable onPress={openInfo}>
        <Image
          source={{ uri: imageUrl(series.image) }}
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          contentFit="cover"
        />
      </Pressable>

      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}>
        <Pressable onPress={openInfo}>
          <SeriesStatsRow
            planCount={series.plans.length}
            totalDays={series.total_days}
            enrolledCount={series.enrolled_count}
          />
          {subtitle ? (
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'Inter-SemiBold',
                color: '#000',
                lineHeight: 24,
                marginTop: 6,
              }}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          ) : null}
        </Pressable>

        {showEnroll ? (
          <Pressable
            onPress={onEnroll}
            disabled={isEnrolling}
            style={({ pressed }) => ({
              marginTop: 14,
              backgroundColor: '#000',
              borderRadius: 999,
              paddingVertical: 14,
              paddingHorizontal: 24,
              alignItems: 'center',
              opacity: pressed || isEnrolling ? 0.75 : 1,
            })}
          >
            {isEnrolling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
                {t('series.enroll')}
              </Text>
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
