import { SeriesStatsRow } from '@/components/series/SeriesPlanRow';
import type { Plan, SeriesDetail, SeriesMetadata } from '@/types/series';
import { cn } from '@/utils/cn';
import { imageUrl } from '@/utils/image-url';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, Pressable, View } from 'react-native';

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
    <View className="rounded-2xl overflow-hidden bg-white">
      <Pressable onPress={openInfo}>
        <Image
          source={{ uri: imageUrl(series.image) }}
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          contentFit="cover"
        />
      </Pressable>

      <View className="px-4 pt-3 pb-4">
        <Pressable onPress={openInfo}>
          <SeriesStatsRow
            planCount={series.plans.length}
            totalDays={series.total_days}
            enrolledCount={series.enrolled_count}
          />
          {subtitle ? (
            <Text
              className="mt-1.5 text-base font-semibold leading-6 text-foreground"
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
            className={cn(
              'mt-3.5 bg-black rounded-full py-3.5 px-6 items-center active:opacity-75',
              isEnrolling && 'opacity-75',
            )}
          >
            {isEnrolling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">{t('series.enroll')}</Text>
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
