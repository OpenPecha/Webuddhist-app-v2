import { StreakWeekTracker } from '@/components/me/StreakWeekTracker';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { StreakStats } from '@/types/user-stats';
import { Fire, ShareNetwork } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

const FLAME_COLOR = '#E8630A';

interface MeStreakCardProps {
  streak: StreakStats;
  onPress?: () => void;
}

export function MeStreakCard({ streak, onPress }: MeStreakCardProps) {
  const { t } = useTranslation();
  const { mutedForeground } = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-2xl border border-border bg-card active:opacity-90"
    >
      <View className="p-4">
        <View className="items-end">
          <ShareNetwork size={20} color={mutedForeground} />
        </View>
        <View className="-mt-2 flex-row items-center justify-center">
          <Fire size={28} color={FLAME_COLOR} weight="fill" />
          <Text className="ml-2 text-xl font-bold">
            {t('me.day_streak', { count: streak.current })}
          </Text>
        </View>
        <Text className="mt-1 text-center text-xs" style={{ color: mutedForeground }}>
          {t('me.best_streak', { count: streak.highest })}
        </Text>
        <View className="mt-5">
          <StreakWeekTracker practicedDays={streak.week} />
        </View>
      </View>
    </Pressable>
  );
}
