import { APP_ASSETS, PHOSPHOR_ICONS } from '@/constants/app-assets';
import { STREAK_SHARE_GOLD } from '@/components/me/StreakShareCapture';
import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { Text } from '@/components/ui/text';
import { useSeriesDayCompleted } from '@/hooks/api/useSeriesDayCompleted';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useUniwind } from 'uniwind';

interface PracticeDaysSheetProps {
  visible: boolean;
  totalDays: number;
  onClose: () => void;
}

export function PracticeDaysSheet({ visible, totalDays, onClose }: PracticeDaysSheetProps) {
  const { t } = useTranslation();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const { foreground, cardBorder } = useThemeColors();
  const { data, isLoading, isError } = useSeriesDayCompleted(visible);
  const ListIcon = PHOSPHOR_ICONS.homeList;
  const series = data?.series ?? [];

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      maxHeight="60%"
      placement="tab"
      scrollable
      sheetClassName={isDark ? 'bg-[#1c1c1c]' : undefined}
      sheetStyle={
        isDark
          ? undefined
          : {
              backgroundColor: STREAK_SHARE_GOLD,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }
      }
    >
      <View className="px-5 pt-1">
        <View className="flex-row items-center gap-2.5">
          <ListIcon size={22} color={foreground} />
          <Text className="flex-1 text-base font-bold">{t('me.days_plan_practiced_suffix')}</Text>
          <Text className="text-base font-bold">{t('me.streak_days_count', { count: totalDays })}</Text>
        </View>
      </View>
      <View className="mx-5 mt-4 h-px" style={{ backgroundColor: cardBorder }} />
      {isLoading ? (
        <View className="py-8">
          <ActivityIndicator color={foreground} />
        </View>
      ) : series.length === 0 ? (
        <Text className="px-5 py-6 text-center text-sm text-muted-foreground">
          {isError ? t('connect.action_error') : t('practice.no_plans')}
        </Text>
      ) : (
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {series.map((item, index) => (
            <View key={item.seriesId || String(index)}>
              {index > 0 ? (
                <View className="mx-5 h-px" style={{ backgroundColor: cardBorder }} />
              ) : null}
              <View className="flex-row items-center px-5 py-3.5">
                <Image
                  source={
                    item.imageUrl
                      ? { uri: item.imageUrl }
                      : APP_ASSETS.seriesCoverFallback
                  }
                  style={{ width: 44, height: 44, borderRadius: 8 }}
                  contentFit="cover"
                />
                <Text className="mx-3 flex-1 text-base font-medium" numberOfLines={2}>
                  {item.seriesTitle}
                </Text>
                <Text className="text-base font-semibold">
                  {t('me.streak_days_count', { count: item.daysCompleted })}
                </Text>
              </View>
            </View>
          ))}
        </BottomSheetScrollView>
      )}
    </AppBottomSheet>
  );
}
