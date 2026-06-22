import { StreakWeekTracker } from '@/components/me/StreakWeekTracker';
import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { StreakStats } from '@/types/user-stats';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { Fire, ShareNetwork } from 'phosphor-react-native';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import ViewShot, { type ViewShotRef } from 'react-native-view-shot';
import { useUniwind } from 'uniwind';

const logo = require('../../../assets/images/webuddhist_gold.png');
const FLAME_COLOR = '#E8630A';
const GOLD_LIGHT = '#F5F0E1';

interface StreakShareContentProps {
  streak: StreakStats;
}

function StreakShareContent({ streak }: StreakShareContentProps) {
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

interface StreakShareSheetProps {
  visible: boolean;
  streak: StreakStats;
  onClose: () => void;
}

export function StreakShareSheet({ visible, streak, onClose }: StreakShareSheetProps) {
  const { t } = useTranslation();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const { foreground } = useThemeColors();
  const viewShotRef = useRef<ViewShotRef>(null);
  const [sharing, setSharing] = useState(false);

  const shareStreak = async () => {
    if (sharing || !viewShotRef.current?.capture) return;
    setSharing(true);
    try {
      const uri = await viewShotRef.current.capture();
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert(t('me.streak_share_error'));
        return;
      }
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t('me.share_this_streak') });
    } catch {
      Alert.alert(t('me.streak_share_error'));
    } finally {
      setSharing(false);
    }
  };

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      maxHeight="90%"
      sheetClassName={isDark ? 'bg-[#1c1c1c]' : undefined}
      sheetStyle={isDark ? undefined : { backgroundColor: GOLD_LIGHT, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
    >
      <View className="px-3">
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          <View style={{ backgroundColor: GOLD_LIGHT, paddingHorizontal: 14, paddingVertical: 20 }}>
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
      </View>

      <View className="mt-8 px-8 pb-2">
        <Pressable
          onPress={shareStreak}
          disabled={sharing}
          className="h-[52px] flex-row items-center justify-center gap-2 rounded-full border border-border bg-card active:opacity-80"
        >
          {sharing ? (
            <ActivityIndicator color={foreground} />
          ) : (
            <>
              <ShareNetwork size={22} color={foreground} />
              <Text className="text-base font-bold">{t('me.share_this_streak')}</Text>
            </>
          )}
        </Pressable>
      </View>
    </AppBottomSheet>
  );
}
