import { StreakShareCapture } from '@/components/me/StreakShareCapture';
import { StreakWeekTracker } from '@/components/me/StreakWeekTracker';
import { Text } from '@/components/ui/text';
import { captureAndShareStreak } from '@/lib/streak-share';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { StreakStats } from '@/types/user-stats';
import { Fire, ShareNetwork } from 'phosphor-react-native';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';
import type { ViewShotRef } from 'react-native-view-shot';

const FLAME_COLOR = '#E8630A';

interface MeStreakCardProps {
  streak: StreakStats;
  onPress?: () => void;
}

export function MeStreakCard({ streak, onPress }: MeStreakCardProps) {
  const { t } = useTranslation();
  const { mutedForeground } = useThemeColors();
  const captureRef = useRef<ViewShotRef>(null);
  const [sharing, setSharing] = useState(false);

  const handleSharePress = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await captureAndShareStreak(captureRef.current, t);
    } finally {
      setSharing(false);
    }
  };

  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card">
      <View className="absolute left-[-5000px] top-0 opacity-0" pointerEvents="none">
        <StreakShareCapture ref={captureRef} streak={streak} />
      </View>

      <Pressable
        onPress={handleSharePress}
        disabled={sharing}
        hitSlop={8}
        className="absolute right-4 top-4 z-10 h-8 w-8 items-center justify-center"
      >
        {sharing ? (
          <ActivityIndicator size="small" color={mutedForeground} />
        ) : (
          <ShareNetwork size={20} color={mutedForeground} />
        )}
      </Pressable>

      <Pressable onPress={onPress} className="p-4 active:opacity-90">
        <View className="flex-row items-center justify-center">
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
      </Pressable>
    </View>
  );
}
