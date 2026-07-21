import { StreakWeekTracker } from '@/components/me/StreakWeekTracker';
import { Text } from '@/components/ui/text';
import type { StreakStats } from '@/types/user-stats';
import { Image } from 'expo-image';
import { Fire } from 'phosphor-react-native';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import ViewShot, { type ViewShotRef } from 'react-native-view-shot';

const logo = require('../../../assets/images/webuddhist_gold.png');
const FLAME_COLOR = '#E8630A';
export const STREAK_SHARE_GOLD = '#F5F0E1';

interface StreakShareContentProps {
  streak: StreakStats;
}

export function StreakShareContent({ streak }: StreakShareContentProps) {
  const { t } = useTranslation();

  return (
    <View className="items-center">
      <Text className="text-center text-[22px] font-bold leading-snug text-[#212121]">
        {t('me.streak_share_quote')}
      </Text>
      <View className="mt-6 flex-row items-center justify-center">
        <Fire size={32} color={FLAME_COLOR} weight="fill" />
        <Text className="ml-2 text-[28px] font-bold text-[#212121]">
          {t('me.streak_days_count', { count: streak.current })}
        </Text>
      </View>
      <Text className="mt-2 text-sm text-[#8a8a8a]">
        {t('me.best_streak', { count: streak.highest })}
      </Text>
      <View className="mt-7 w-full">
        <StreakWeekTracker practicedDays={streak.week} forShare />
      </View>
    </View>
  );
}

interface StreakShareCaptureProps {
  streak: StreakStats;
}

export const StreakShareCapture = forwardRef<ViewShotRef, StreakShareCaptureProps>(
  function StreakShareCapture({ streak }, ref) {
    const { t } = useTranslation();

    return (
      <ViewShot ref={ref} options={{ format: 'png', quality: 1 }}>
        <View className="px-3.5 py-5" style={{ backgroundColor: STREAK_SHARE_GOLD }}>
          <View className="rounded-xl bg-white px-6 pb-7 pt-8">
            <StreakShareContent streak={streak} />
          </View>
          <View className="mt-6 items-center">
            <Image source={logo} style={{ width: 32, height: 32 }} contentFit="contain" />
            <Text className="mt-2 text-xs text-[#8a8a8a]">{t('me.shared_from')}</Text>
            <Text className="text-sm font-semibold text-[#212121]">{t('appTitle')}</Text>
          </View>
        </View>
      </ViewShot>
    );
  },
);
