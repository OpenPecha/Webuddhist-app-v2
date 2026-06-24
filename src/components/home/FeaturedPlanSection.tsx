import { FeaturedPlanSectionSkeleton } from '@/components/home/FeaturedPlanSectionSkeleton';
import { APP_ASSETS } from '@/constants/app-assets';
import { useFeaturedSeries } from '@/hooks/api/useFeaturedSeries';
import { useRoutineInfo } from '@/hooks/api/useRoutineInfo';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { FeaturedSeriesLayout } from '@/types/featured-series';
import type { Series } from '@/types/series';
import { imageUrl } from '@/utils/image-url';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View, type ImageStyle, type StyleProp } from 'react-native';

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
}: {
  series: Series;
  style: StyleProp<ImageStyle>;
}) {
  const [failed, setFailed] = useState(false);
  const remote = imageUrl(series.image);

  return (
    <Image
      source={failed || !remote ? APP_ASSETS.seriesCoverFallback : { uri: remote }}
      style={style}
      contentFit="cover"
      onError={() => setFailed(true)}
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
  const { foreground, mutedForeground, cardSurface } = useThemeColors();
  const dateRange = formatSeriesDateRange(series);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: cardSurface,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: contentPadding,
        }}
      >
        <SeriesCoverImage
          series={series}
          style={{ width: 72, height: 72, borderRadius: 12 }}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              fontSize: titleFontSize,
              fontWeight: '600',
              fontFamily: 'Inter-SemiBold',
              color: foreground,
            }}
            numberOfLines={2}
          >
            {series.metadata?.title}
          </Text>
          {dateRange ? (
            <Text
              style={{
                marginTop: titleDateGap,
                fontSize: dateFontSize,
                color: mutedForeground,
                fontFamily: 'Inter-Regular',
              }}
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
  const { foreground, mutedForeground, cardSurface } = useThemeColors();
  const dateRange = formatSeriesDateRange(series);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: cardSurface,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <SeriesCoverImage
        series={series}
        style={{ width: '100%', aspectRatio: 16 / 9 }}
      />
      <View
        style={{
          paddingLeft: contentPadding,
          paddingRight: contentPadding,
          paddingTop: contentPadding,
          paddingBottom: contentPadding + 4,
        }}
      >
        <Text
          style={{
            fontSize: titleFontSize,
            fontWeight: '700',
            fontFamily: 'Inter-Bold',
            color: foreground,
          }}
          numberOfLines={2}
        >
          {series.metadata?.title}
        </Text>
        {dateRange ? (
          <Text
            style={{
              marginTop: titleDateGap,
              fontSize: dateFontSize,
              color: mutedForeground,
              fontFamily: 'Inter-Regular',
            }}
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
  const { foreground } = useThemeColors();
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
    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
      <Text
        style={{
          fontSize: sectionTitleSize,
          fontWeight: '700',
          fontFamily: 'Inter-Bold',
          color: foreground,
        }}
      >
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
              <View key={series.id} style={{ marginTop: heroOthersGap, marginBottom: itemBottomGap }}>
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
