import { APP_ASSETS } from '@/constants/app-assets';
import { STREAK_SHARE_GOLD } from '@/components/me/StreakShareCapture';
import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { Text } from '@/components/ui/text';
import { useMantraCounts } from '@/hooks/api/useMantraCounts';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { CirclesThree } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { useUniwind } from 'uniwind';

interface AccumulationSheetProps {
  visible: boolean;
  formattedTotal: string;
  onClose: () => void;
}

function MalaBeadImage({ imageUrl }: { imageUrl: string | null }) {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: 44, height: 44, borderRadius: 22 }}
        contentFit="cover"
      />
    );
  }

  return (
    <Image
      source={APP_ASSETS.malaIcon}
      style={{ width: 44, height: 44 }}
      contentFit="contain"
    />
  );
}

export function AccumulationSheet({ visible, formattedTotal, onClose }: AccumulationSheetProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const { foreground, cardBorder } = useThemeColors();
  const { data, isLoading, isError } = useMantraCounts(visible);
  const counts = data?.counts ?? [];

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
          <CirclesThree size={22} color={foreground} />
          <Text className="flex-1 text-base font-bold">{t('me.accumulation')}</Text>
          <Text className="text-base font-bold">{formattedTotal}</Text>
        </View>
      </View>
      <View className="mx-5 mt-4 h-px" style={{ backgroundColor: cardBorder }} />
      {isLoading ? (
        <View className="py-8">
          <ActivityIndicator color={foreground} />
        </View>
      ) : counts.length === 0 ? (
        <Text className="px-5 py-6 text-center text-sm text-muted-foreground">
          {isError ? t('connect.action_error') : t('practice.no_plans')}
        </Text>
      ) : (
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {counts.map((item, index) => (
            <View key={item.mantraId || String(index)}>
              {index > 0 ? (
                <View className="mx-5 h-px" style={{ backgroundColor: cardBorder }} />
              ) : null}
              <View className="flex-row items-center px-5 py-3.5">
                <MalaBeadImage imageUrl={item.malaImageUrl} />
                <Text className="mx-3 flex-1 text-base font-medium" numberOfLines={2}>
                  {item.mantraTitle}
                </Text>
                <Text className="text-base font-semibold">
                  {new Intl.NumberFormat(i18n.language).format(item.totalCount)}
                </Text>
              </View>
            </View>
          ))}
        </BottomSheetScrollView>
      )}
    </AppBottomSheet>
  );
}
