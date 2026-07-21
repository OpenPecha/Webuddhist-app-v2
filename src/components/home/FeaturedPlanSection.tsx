import { Text } from '@/components/ui/text';
import { FeaturedPlanSectionSkeleton } from '@/components/home/FeaturedPlanSectionSkeleton';
import { APP_ASSETS } from '@/constants/app-assets';
import { useFeaturedSeries } from '@/hooks/api/useFeaturedSeries';
import { useRoutineInfo } from '@/hooks/api/useRoutineInfo';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { FeaturedSeriesLayout } from '@/types/featured-series';
import type { Series } from '@/types/series';
import { resolveCoverImage } from '@/utils/image-url';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View, type ImageStyle, type StyleProp } from 'react-native';

function formatSeriesDateRange(series: Series): string | null {
  if (!series.start_date || !series.end_date) return null;
  const start = new Date(series.start_date);
  const end = new Date(series.end_date);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function SeriesCoverImage({
  series,
  style,
  size = 'medium',
}: {
  series: Series;
  style: StyleProp<ImageStyle>;
  size?: 'thumbnail' | 'medium' | 'original';
}) {
  const uri = resolveCoverImage(series.image, series.image_url, size);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
  }, [uri]);

  const useFallback = !uri || loadFailed;

  return (
    <Image
      source={useFallback ? APP_ASSETS.seriesCoverFallback : { uri }}
      style={style}
      contentFit="cover"
      recyclingKey={`${series.id}-${size}`}
      onError={() => setLoadFailed(true)}
    />
  );
}

function FeaturedPlanListItem({
  series,
  onPress,
  titleFontSize,
  dateFontSize,
  titleDateGap,
  contentPadding,
}: {
  series: Series;
  onPress: () => void;
  titleFontSize: number;
  dateFontSize: number;
  titleDateGap: number;
  contentPadding: number;
}) {
  const { cardSurface } = useThemeColors();
  const dateRange = formatSeriesDateRange(series);

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-2xl active:opacity-90"
      style={{ backgroundColor: cardSurface }}
    >
      <View
        className="flex-row items-center"
        style={{ padding: contentPadding }}
      >
        <SeriesCoverImage
          series={series}
          size="thumbnail"
          style={{ width: 72, height: 72, borderRadius: 12 }}
        />
        <View className="ml-3 flex-1">
          <Text
            className="font-semibold text-foreground"
            style={{ fontSize: titleFontSize }}
            numberOfLines={2}
          >
            {series.metadata?.title}
          </Text>
          {dateRange ? (
            <Text
              className="text-muted-foreground"
              style={{ marginTop: titleDateGap, fontSize: dateFontSize }}
              numberOfLines={1}
            >
              {dateRange}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function FeaturedPlanHeroCard({
  series,
  onPress,
  titleFontSize,
  dateFontSize,
  titleDateGap,
  contentPadding,
}: {
  series: Series;
  onPress: () => void;
  titleFontSize: number;
  dateFontSize: number;
  titleDateGap: number;
  contentPadding: number;
}) {
  const { cardSurface } = useThemeColors();
  const dateRange = formatSeriesDateRange(series);

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-2xl active:opacity-90"
      style={{ backgroundColor: cardSurface }}
    >
      <View className="aspect-video w-full">
        <SeriesCoverImage
          series={series}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View
        style={{
          paddingLeft: contentPadding,
          paddingRight: contentPadding,
          paddingTop: contentPadding,
          paddingBottom: contentPadding + 4,
        }}
      >
        <Text
          className="font-bold text-foreground"
          style={{ fontSize: titleFontSize }}
          numberOfLines={2}
        >
          {series.metadata?.title}
        </Text>
        {dateRange ? (
          <Text
            className="text-muted-foreground"
            style={{ marginTop: titleDateGap, fontSize: dateFontSize }}
            numberOfLines={1}
          >
            {dateRange}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function FeaturedPlanContent({
  layout,
  hasStatsCard,
  onSeriesTap,
}: {
  layout: FeaturedSeriesLayout;
  hasStatsCard: boolean;
  onSeriesTap: (series: Series) => void;
}) {
  const { t } = useTranslation();
  const language = useContentLanguage();
  const isTibetan = language === 'bo';
  const sectionTitleSize = isTibetan ? 16 : 18;
  const titleFontSize = isTibetan ? 14 : 16;
  const dateFontSize = isTibetan ? 12 : 13;
  const sectionContentGap = isTibetan ? 16 : 12;
  const itemBottomGap = isTibetan ? 16 : 12;
  const heroOthersGap = isTibetan ? 20 : 16;
  const contentPadding = isTibetan ? 16 : 12;
  const titleDateGap = isTibetan ? 8 : 4;
  const allSeries = [layout.featured, ...layout.others];

  const listItemProps = {
    titleFontSize,
    dateFontSize,
    titleDateGap,
    contentPadding,
  };

  return (
    <View className="px-4 pb-4">
      <Text className="font-bold text-foreground" style={{ fontSize: sectionTitleSize }}>
        {t('home.creator_featured_plan')}
      </Text>
      <View style={{ height: sectionContentGap }} />
      {hasStatsCard
        ? allSeries.map((series) => (
            <View key={series.id} style={{ marginBottom: itemBottomGap }}>
              <FeaturedPlanListItem
                series={series}
                onPress={() => onSeriesTap(series)}
                {...listItemProps}
              />
            </View>
          ))
        : (
          <>
            <FeaturedPlanHeroCard
              series={layout.featured}
              onPress={() => onSeriesTap(layout.featured)}
              {...listItemProps}
            />
            {layout.others.map((series) => (
              <View
                key={series.id}
                style={{ marginTop: heroOthersGap, marginBottom: itemBottomGap }}
              >
                <FeaturedPlanListItem
                  series={series}
                  onPress={() => onSeriesTap(series)}
                  {...listItemProps}
                />
              </View>
            ))}
          </>
        )}
    </View>
  );
}

export function FeaturedPlanSection() {
  const router = useRouter();
  const { data: layout, isLoading, isError } = useFeaturedSeries();
  const { data: routineInfo } = useRoutineInfo();

  if (isLoading) return <FeaturedPlanSectionSkeleton />;
  if (isError || !layout) return null;

  const hasStatsCard =
    (routineInfo?.seriesCount ?? 0) > 0 ||
    (routineInfo?.recitationCount ?? 0) > 0;

  return (
    <FeaturedPlanContent
      layout={layout}
      hasStatsCard={hasStatsCard}
      onSeriesTap={(series) => router.push(`/series/${series.id}`)}
    />
  );
}
