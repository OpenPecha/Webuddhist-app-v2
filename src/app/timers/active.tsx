import { Text } from '@/components/ui/text';
import { TimerProgressRing } from '@/components/timer/TimerProgressRing';
import { useActiveTimer } from '@/hooks/useActiveTimer';
import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/utils/cn';
import { stopUserTimer } from '@/services/timers';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pause, Play } from 'phosphor-react-native';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslate } from '@tolgee/react';
import { BackHandler, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RING_SIZE = 280;
const CONTROLS_HEIGHT = 56;
const DURATION_FONT_SIZE = 40;
const FOOTER_MIN_HEIGHT = 120;

export default function ActiveTimerScreen() {
  const { t } = useTranslate();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { foreground, isDark } = useThemeColors();

  const params = useLocalSearchParams<{ id: string; durationMs: string; name?: string }>();
  const timerId = params.id ?? '';
  const totalMs = Number(params.durationMs) || 0;

  const reportStop = useCallback(
    (elapsedMs: number) => {
      if (!timerId) return;
      void stopUserTimer(timerId, elapsedMs);
    },
    [timerId],
  );

  const soundPlayerRef = useRef<{ play: () => void } | null>(null);

  useEffect(() => {
    let mounted = true;
    void import('@/components/timer/TimerSoundPlayer').then(({ createTimerSoundPlayer }) =>
      createTimerSoundPlayer().then((player) => {
        if (!mounted) return;
        soundPlayerRef.current = player;
      }),
    );
    return () => {
      mounted = false;
      soundPlayerRef.current = null;
    };
  }, []);

  const {
    phase,
    elapsedMs,
    elapsedProgress,
    centerText,
    showFinish,
    showDiscard,
    showPlayPause,
    isPlayIcon,
    isPaused,
    togglePause,
    stopTimer,
  } = useActiveTimer({
    totalMs,
    onSessionStart: () => soundPlayerRef.current?.play(),
    onComplete: () => {
      soundPlayerRef.current?.play();
      reportStop(totalMs);
    },
  });

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const handleTogglePause = () => {
    if (phase === 'running' && !isPaused) {
      reportStop(elapsedMs);
    }
    if (phase === 'finished') return;
    togglePause();
  };

  const handleFinish = () => {
    stopTimer();
    if (phase === 'running') {
      reportStop(elapsedMs);
    }
    router.back();
  };

  const handleDiscard = () => {
    stopTimer();
    router.back();
  };

  const showFooter = phase !== 'countdown';

  return (
    <View
      className={cn('flex-1', isDark ? 'bg-black' : 'bg-[#FBF9F4]')}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 items-center justify-center">
        <TimerProgressRing progress={elapsedProgress} size={RING_SIZE}>
          <View className="h-12 justify-center">
            <Text
              className="text-center font-semibold text-foreground"
              style={{
                fontSize: DURATION_FONT_SIZE,
                letterSpacing: 1,
              }}
            >
              {centerText}
            </Text>
          </View>
        </TimerProgressRing>

        <View className="h-12" />

        <View className="h-14 justify-center">
          {showPlayPause ? (
            <Pressable
              onPress={handleTogglePause}
              disabled={phase === 'finished'}
              className="items-center justify-center"
              style={{
                width: CONTROLS_HEIGHT,
                height: CONTROLS_HEIGHT,
                opacity: phase === 'finished' ? 0.4 : 1,
              }}
            >
              {isPlayIcon ? (
                <Play size={40} color={foreground} weight="fill" />
              ) : (
                <Pause size={40} color={foreground} weight="fill" />
              )}
            </Pressable>
          ) : null}
        </View>
      </View>

      <View
        className="px-6 pb-8"
        style={{ minHeight: FOOTER_MIN_HEIGHT, opacity: showFooter ? 1 : 0 }}
        pointerEvents={showFooter ? 'auto' : 'none'}
      >
        <View style={{ opacity: showFinish ? 1 : 0 }} pointerEvents={showFinish ? 'auto' : 'none'}>
          <Pressable
            onPress={handleFinish}
            style={({ pressed }) => ({
              alignSelf: 'center',
              borderRadius: 999,
              borderWidth: 1,
              borderColor: foreground,
              backgroundColor: isDark ? '#252525' : '#FFFFFF',
              paddingHorizontal: 46,
              paddingVertical: 16,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text className="text-base font-medium text-foreground">{t('timer_finish')}</Text>
          </Pressable>
        </View>

        <View className="h-4" />

        <View style={{ opacity: showDiscard ? 1 : 0 }} pointerEvents={showDiscard ? 'auto' : 'none'}>
          <Pressable onPress={handleDiscard} className="self-center px-4 py-2 active:opacity-70">
            <Text className="text-base font-medium text-foreground">{t('timer_discard_session')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
