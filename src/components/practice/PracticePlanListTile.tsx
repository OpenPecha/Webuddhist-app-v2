import { APP_ASSETS } from '@/constants/app-assets';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { Series, SeriesListProgress } from '@/types/series';
import { formatPlanDateRangeOrNull } from '@/utils/plan-date-format';
import { resolveCoverImage } from '@/utils/image-url';
import { Image } from 'expo-image';
import { UsersThree } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const META_SIZE = 13;

function seriesProgressFraction(progress: SeriesListProgress): number {
  if (progress.total_day_count <= 0) return 0;
  return Math.min(1, Math.max(0, progress.current_day_number / progress.total_day_count));
}

function SeriesCoverThumb({ series }: { series: Series }) {
  const uri = resolveCoverImage(series.image, series.image_url, 'thumbnail');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  return (
    <Image
      source={!uri || failed ? APP_ASSETS.seriesCoverFallback : { uri }}
      style={{ width: 56, height: 56, borderRadius: 12 }}
      contentFit="cover"
      recyclingKey={series.id}
      onError={() => setFailed(true)}
    />
  );
}

function EnrolledCount({ count }: { count: number }) {
  const { mutedForeground } = useThemeColors();

  return (
    <View className="flex-row items-center gap-1">
      <UsersThree size={META_SIZE + 2} color={mutedForeground} weight="regular" />
      <Text className="text-[13px] font-medium text-muted-foreground">{count}</Text>
    </View>
  );
}

function ProgressBar({ progress }: { progress: SeriesListProgress }) {
  const fraction = seriesProgressFraction(progress);

  return (
    <View className="w-1/2">
      <View className="h-1.5 overflow-hidden rounded bg-muted/30 dark:bg-muted/60">
        <View className="h-full bg-brand" style={{ width: `${fraction * 100}%` }} />
      </View>
    </View>
  );
}

interface PracticePlanListTileProps {
  series: Series;
  onPress: () => void;
}

export function PracticePlanListTile({ series, onPress }: PracticePlanListTileProps) {
  const dateRange = formatPlanDateRangeOrNull(series.start_date, series.end_date);
  const enrolled = series.enrolled_count ?? 0;
  const progress = series.progress;
  const hasProgress = !!progress && progress.total_day_count > 0;
  const hasPartner = !!series.partner?.group_name;

  return (
    <Pressable onPress={onPress} className="rounded-2xl bg-card active:opacity-90">
      <View className="flex-row items-center p-3">
        <SeriesCoverThumb series={series} />
        <View className="ml-3 flex-1 justify-center">
          <Text
            className="text-[15px] font-bold leading-[19.5px] text-foreground"
            numberOfLines={1}
          >
            {series.metadata?.title ?? ''}
          </Text>

          {hasPartner ? (
            hasProgress ? (
              <View className="mt-2 flex-row items-center justify-between gap-2">
                <View className="flex-1">
                  <ProgressBar progress={progress!} />
                </View>
                {enrolled > 0 ? <EnrolledCount count={enrolled} /> : null}
              </View>
            ) : enrolled > 0 ? (
              <View className="mt-1 items-end">
                <EnrolledCount count={enrolled} />
              </View>
            ) : null
          ) : (
            <>
              {dateRange || enrolled > 0 ? (
                <View className="mt-1 flex-row items-center gap-2">
                  {dateRange ? (
                    <Text
                      className="flex-1 text-[13px] font-medium text-muted-foreground"
                      numberOfLines={1}
                    >
                      {dateRange}
                    </Text>
                  ) : (
                    <View className="flex-1" />
                  )}
                  {enrolled > 0 ? <EnrolledCount count={enrolled} /> : null}
                </View>
              ) : null}
              {hasProgress ? (
                <View className="mt-2">
                  <ProgressBar progress={progress!} />
                </View>
              ) : null}
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}
