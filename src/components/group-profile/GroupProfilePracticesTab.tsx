import {
  GP_CAPTION_SIZE,
  GP_PADDING,
  GP_SERIES_THUMB,
  GP_SERIES_THUMB_RADIUS,
} from '@/components/group-profile/group-profile-styles';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatSeriesDateRange } from '@/lib/group-profile-format';
import { pickSeriesMetadata } from '@/types/series';
import type { Plan, Series } from '@/types/series';
import { imageUrl } from '@/utils/image-url';
import { BookOpenText } from 'phosphor-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

interface GroupProfilePracticesTabProps {
  seriesList: Series[];
  plansList: Plan[];
}

export function GroupProfilePracticesTab({ seriesList, plansList }: GroupProfilePracticesTabProps) {
  const router = useRouter();
  const language = useContentLanguage();
  const { t, i18n } = useTranslation();
  const { foreground, mutedForeground, skeleton, cardBorder } = useThemeColors();

  if (seriesList.length === 0 && plansList.length === 0) {
    return (
      <Text style={{ color: mutedForeground, textAlign: 'center', marginTop: 24, paddingHorizontal: GP_PADDING }}>
        {t('connect.no_practices')}
      </Text>
    );
  }

  const rows: ReactNode[] = [];

  seriesList.forEach((series, index) => {
    const seriesMeta = pickSeriesMetadata(
      Array.isArray(series.metadata) ? series.metadata : [series.metadata],
      language,
    );
    const subtitle =
      seriesMeta?.sub_title?.trim() ||
      formatSeriesDateRange(series.start_date, series.end_date, i18n.language);

    rows.push(
      <Pressable
        key={`series-${series.id}`}
        onPress={() => router.push(`/series/${series.id}`)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: GP_PADDING,
          paddingVertical: 6,
          opacity: pressed ? 0.75 : 1,
          borderBottomWidth: index < seriesList.length - 1 || plansList.length > 0 ? 1 : 0,
          borderBottomColor: cardBorder,
        })}
      >
        <View
          style={{
            width: GP_SERIES_THUMB,
            height: GP_SERIES_THUMB,
            borderRadius: GP_SERIES_THUMB_RADIUS,
            overflow: 'hidden',
            backgroundColor: skeleton,
          }}
        >
          {series.image ? (
            <Image
              source={{ uri: imageUrl(series.image, 'thumbnail') }}
              style={{ width: GP_SERIES_THUMB, height: GP_SERIES_THUMB }}
              contentFit="cover"
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <BookOpenText size={22} color={mutedForeground} />
            </View>
          )}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: 'Inter-SemiBold',
              color: foreground,
            }}
            numberOfLines={1}
          >
            {seriesMeta?.title ?? series.id}
          </Text>
          {subtitle ? (
            <Text
              style={{ fontSize: GP_CAPTION_SIZE, color: mutedForeground, marginTop: 2 }}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </Pressable>,
    );
  });

  plansList.forEach((plan, index) => {
    const subtitle = formatSeriesDateRange(plan.start_date, null, i18n.language);

    rows.push(
      <Pressable
        key={`plan-${plan.id}`}
        onPress={() => router.push(`/plans/${plan.id}`)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: GP_PADDING,
          paddingVertical: 6,
          opacity: pressed ? 0.75 : 1,
          borderBottomWidth: index < plansList.length - 1 ? 1 : 0,
          borderBottomColor: cardBorder,
        })}
      >
        <View
          style={{
            width: GP_SERIES_THUMB,
            height: GP_SERIES_THUMB,
            borderRadius: GP_SERIES_THUMB_RADIUS,
            overflow: 'hidden',
            backgroundColor: skeleton,
          }}
        >
          {plan.image ? (
            <Image
              source={{ uri: imageUrl(plan.image, 'thumbnail') }}
              style={{ width: GP_SERIES_THUMB, height: GP_SERIES_THUMB }}
              contentFit="cover"
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <BookOpenText size={22} color={mutedForeground} />
            </View>
          )}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: 'Inter-SemiBold',
              color: foreground,
            }}
            numberOfLines={1}
          >
            {plan.title}
          </Text>
          {subtitle ? (
            <Text
              style={{ fontSize: GP_CAPTION_SIZE, color: mutedForeground, marginTop: 2 }}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </Pressable>,
    );
  });

  return <View style={{ paddingTop: 16 }}>{rows}</View>;
}
