import { APP_ASSETS } from '@/constants/app-assets';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { Series } from '@/types/series';
import { formatPlanDateRangeOrNull } from '@/utils/plan-date-format';
import { resolveCoverImage } from '@/utils/image-url';
import { Image } from 'expo-image';
import { UsersThree } from 'phosphor-react-native';
import { useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { Pressable, View } from 'react-native';

export const PRACTICE_PLAN_CARD_WIDTH = 300;

const COVER_HEIGHT = 150;
const META_SIZE = 12;

function CoverImage({ series }: { series: Series }) {
  const uri = resolveCoverImage(series.image, series.image_url, 'medium');

  // Keyed by uri so the failure state resets when the card is recycled for another series.
  return <CoverImageSource key={uri} uri={uri} recyclingKey={series.id} />;
}

function CoverImageSource({ uri, recyclingKey }: { uri: string; recyclingKey: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <Image
      source={!uri || failed ? APP_ASSETS.seriesCoverFallback : { uri }}
      style={{ width: '100%', height: COVER_HEIGHT }}
      contentFit="cover"
      recyclingKey={recyclingKey}
      onError={() => setFailed(true)}
    />
  );
}

function EnrolledCount({ count }: { count: number }) {
  const { mutedForeground } = useThemeColors();

  return (
    <View className="flex-row items-center gap-1">
      <UsersThree size={META_SIZE + 2} color={mutedForeground} weight="regular" />
      <Text className="text-[12px] font-medium text-muted-foreground">{count}</Text>
    </View>
  );
}

function PartnerRow({ groupName, groupImage }: { groupName: string; groupImage?: string | null }) {
  const { t } = useTranslate();

  return (
    <View className="flex-1 flex-row items-center gap-2">
      {groupImage ? (
        <Image
          source={{ uri: groupImage }}
          style={{ width: 28, height: 28, borderRadius: 14 }}
          contentFit="cover"
        />
      ) : null}
      <Text className="flex-1 text-[12px] font-semibold text-muted-foreground" numberOfLines={1}>
        {t('series_practicing_with_group', { groupName })}
      </Text>
    </View>
  );
}

interface PracticePlanCardProps {
  series: Series;
  onPress: () => void;
}

/** Horizontal carousel card for the Practice explore Plans section (Flutter PracticePlanCard). */
export function PracticePlanCard({ series, onPress }: PracticePlanCardProps) {
  const dateRange = formatPlanDateRangeOrNull(series.start_date, series.end_date);
  const enrolled = series.enrolled_count ?? 0;
  const partner = series.partner;
  const hasPartner = !!partner?.group_name;

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-xl bg-card active:opacity-90"
      style={{ width: PRACTICE_PLAN_CARD_WIDTH }}
      accessibilityRole="button"
      accessibilityLabel={series.metadata?.title ?? ''}
    >
      <CoverImage series={series} />
      <View className="px-2 pb-1.5 pt-3.5">
        <Text
          className="text-[14px] font-semibold leading-[18px] text-foreground"
          numberOfLines={1}
        >
          {series.metadata?.title ?? ''}
        </Text>
      </View>
      {hasPartner ? (
        <View className="flex-row items-center justify-between gap-2 px-2 pb-2">
          <PartnerRow groupName={partner!.group_name} groupImage={partner!.group_image} />
          {enrolled > 0 ? <EnrolledCount count={enrolled} /> : null}
        </View>
      ) : dateRange || enrolled > 0 ? (
        <View className="flex-row items-center gap-2 px-2 pb-2">
          {dateRange ? (
            <Text className="flex-1 text-[12px] font-medium text-muted-foreground" numberOfLines={1}>
              {dateRange}
            </Text>
          ) : (
            <View className="flex-1" />
          )}
          {enrolled > 0 ? <EnrolledCount count={enrolled} /> : null}
        </View>
      ) : null}
    </Pressable>
  );
}
