import { APP_ASSETS } from '@/constants/app-assets';
import { AppColors } from '@/constants/app-colors';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { Series, SeriesListProgress } from '@/types/series';
import { formatPlanDateRangeOrNull } from '@/utils/plan-date-format';
import { resolveCoverImage } from '@/utils/image-url';
import { Image } from 'expo-image';
import { UsersThree } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const TITLE_SIZE = 15;
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

function EnrolledCount({ count, color }: { count: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <UsersThree size={META_SIZE + 2} color={color} weight="regular" />
      <Text
        style={{
          fontSize: META_SIZE,
          fontWeight: '500',
          fontFamily: 'Inter-Regular',
          color,
        }}
      >
        {count}
      </Text>
    </View>
  );
}

function ProgressBar({ progress, brand, isDark }: { progress: SeriesListProgress; brand: string; isDark: boolean }) {
  const fraction = seriesProgressFraction(progress);
  const track = isDark ? 'rgba(66,66,66,0.6)' : AppColors.grey100;

  return (
    <View style={{ width: '50%' }}>
      <View
        style={{
          height: 6,
          borderRadius: 4,
          backgroundColor: track,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${fraction * 100}%`,
            height: '100%',
            backgroundColor: brand,
          }}
        />
      </View>
    </View>
  );
}

interface PracticePlanListTileProps {
  series: Series;
  onPress: () => void;
}

export function PracticePlanListTile({ series, onPress }: PracticePlanListTileProps) {
  const { foreground, mutedForeground, cardSurface, brand, isDark } = useThemeColors();
  const dateRange = formatPlanDateRangeOrNull(series.start_date, series.end_date);
  const enrolled = series.enrolled_count ?? 0;
  const progress = series.progress;
  const hasProgress = !!progress && progress.total_day_count > 0;
  const hasPartner = !!series.partner?.group_name;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: 16,
        backgroundColor: cardSurface,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
        <SeriesCoverThumb series={series} />
        <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: TITLE_SIZE,
              fontWeight: '700',
              fontFamily: 'Inter-Bold',
              color: foreground,
              lineHeight: TITLE_SIZE * 1.3,
            }}
            numberOfLines={1}
          >
            {series.metadata?.title ?? ''}
          </Text>

          {hasPartner ? (
            hasProgress ? (
              <View
                style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <ProgressBar progress={progress!} brand={brand} isDark={isDark} />
                </View>
                {enrolled > 0 ? <EnrolledCount count={enrolled} color={mutedForeground} /> : null}
              </View>
            ) : enrolled > 0 ? (
              <View style={{ marginTop: 4, alignItems: 'flex-end' }}>
                <EnrolledCount count={enrolled} color={mutedForeground} />
              </View>
            ) : null
          ) : (
            <>
              {dateRange || enrolled > 0 ? (
                <View
                  style={{
                    marginTop: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {dateRange ? (
                    <Text
                      style={{
                        flex: 1,
                        fontSize: META_SIZE,
                        fontWeight: '500',
                        fontFamily: 'Inter-Regular',
                        color: mutedForeground,
                      }}
                      numberOfLines={1}
                    >
                      {dateRange}
                    </Text>
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}
                  {enrolled > 0 ? <EnrolledCount count={enrolled} color={mutedForeground} /> : null}
                </View>
              ) : null}
              {hasProgress ? (
                <View style={{ marginTop: 8 }}>
                  <ProgressBar progress={progress!} brand={brand} isDark={isDark} />
                </View>
              ) : null}
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}
