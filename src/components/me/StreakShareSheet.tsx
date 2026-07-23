import { StreakShareCapture, STREAK_SHARE_GOLD } from '@/components/me/StreakShareCapture';
import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { Text } from '@/components/ui/text';
import { captureAndShareStreak } from '@/lib/streak-share';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { StreakStats } from '@/types/user-stats';
import { ShareNetwork } from 'phosphor-react-native';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import type { ViewShotRef } from 'react-native-view-shot';
import { useUniwind } from 'uniwind';
import { useTranslate } from '@tolgee/react';

interface StreakShareSheetProps {
  visible: boolean;
  streak: StreakStats;
  onClose: () => void;
}

export function StreakShareSheet({ visible, streak, onClose }: StreakShareSheetProps) {
  const { t } = useTranslate();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const { foreground } = useThemeColors();
  const viewShotRef = useRef<ViewShotRef>(null);
  const [sharing, setSharing] = useState(false);

  const shareStreak = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await captureAndShareStreak(viewShotRef.current);
    } finally {
      setSharing(false);
    }
  };

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      maxHeight="85%"
      placement="tab"
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
      <View className="px-3">
        <StreakShareCapture ref={viewShotRef} streak={streak} />
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
              <Text className="text-base font-bold">{t('share_this_streak')}</Text>
            </>
          )}
        </Pressable>
      </View>
    </AppBottomSheet>
  );
}
