import {
  GP_SERIES_THUMB,
  GP_SERIES_THUMB_RADIUS,
} from '@/components/group-profile/group-profile-styles';
import { Text } from '@/components/ui/text';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppLanguage } from '@/lib/tolgee';
import { formatSeriesDateRange } from '@/lib/group-profile-format';
import { pickSeriesMetadata } from '@/types/series';
import type { Plan, Series } from '@/types/series';
import { imageUrl } from '@/utils/image-url';
import { BookOpenText } from 'phosphor-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

interface GroupProfilePracticesTabProps {
  seriesList: Series[];
  plansList: Plan[];
}

export function GroupProfilePracticesTab({ seriesList, plansList }: GroupProfilePracticesTabProps) {
  const router = useRouter();
  const language = useContentLanguage();
  const uiLanguage = useAppLanguage();
  const { mutedForeground, skeleton, cardBorder } = useThemeColors();

  if (seriesList.length === 0 && plansList.length === 0) {
    return (
      <Text className="mt-6 px-4 text-center text-muted-foreground">{"No practices yet."}</Text>
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
      formatSeriesDateRange(series.start_date, series.end_date, uiLanguage);

    rows.push(
      <Pressable
        key={`series-${series.id}`}
        onPress={() => router.push(`/series/${series.id}`)}
        className="flex-row items-center px-4 py-1.5 active:opacity-75"
        style={{
          borderBottomWidth: index < seriesList.length - 1 || plansList.length > 0 ? 1 : 0,
          borderBottomColor: cardBorder,
        }}
      >
        <View
          className="overflow-hidden"
          style={{
            width: GP_SERIES_THUMB,
            height: GP_SERIES_THUMB,
            borderRadius: GP_SERIES_THUMB_RADIUS,
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
            <View className="flex-1 items-center justify-center">
              <BookOpenText size={22} color={mutedForeground} />
            </View>
          )}
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-[15px] font-semibold text-foreground" numberOfLines={1}>
            {seriesMeta?.title ?? series.id}
          </Text>
          {subtitle ? (
            <Text className="mt-0.5 text-[13px] text-muted-foreground" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </Pressable>,
    );
  });

  plansList.forEach((plan, index) => {
    const subtitle = formatSeriesDateRange(plan.start_date, null, uiLanguage);

    rows.push(
      <Pressable
        key={`plan-${plan.id}`}
        onPress={() => router.push(`/plans/${plan.id}`)}
        className="flex-row items-center px-4 py-1.5 active:opacity-75"
        style={{
          borderBottomWidth: index < plansList.length - 1 ? 1 : 0,
          borderBottomColor: cardBorder,
        }}
      >
        <View
          className="overflow-hidden"
          style={{
            width: GP_SERIES_THUMB,
            height: GP_SERIES_THUMB,
            borderRadius: GP_SERIES_THUMB_RADIUS,
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
            <View className="flex-1 items-center justify-center">
              <BookOpenText size={22} color={mutedForeground} />
            </View>
          )}
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-[15px] font-semibold text-foreground" numberOfLines={1}>
            {plan.title}
          </Text>
          {subtitle ? (
            <Text className="mt-0.5 text-[13px] text-muted-foreground" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </Pressable>,
    );
  });

  return <View className="pt-4">{rows}</View>;
}
