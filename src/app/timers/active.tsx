import '@/lib/i18n';
import { TimerProgressRing } from '@/components/timer/TimerProgressRing';
import { useActiveTimer } from '@/hooks/useActiveTimer';
import { useThemeColors } from '@/hooks/useThemeColors';
import { stopUserTimer } from '@/services/timers';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pause, Play } from 'phosphor-react-native';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RING_SIZE = 280;
const CONTROLS_SPACING = 48;
const CONTROLS_HEIGHT = 56;
const CENTER_TEXT_HEIGHT = 48;
const DURATION_FONT_SIZE = 40;
const FOOTER_MIN_HEIGHT = 120;

export default function ActiveTimerScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { foreground, scaffoldBackground, isDark } = useThemeColors();

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
      style={{
        flex: 1,
        backgroundColor: scaffoldBackground,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TimerProgressRing progress={elapsedProgress} size={RING_SIZE}>
          <View style={{ height: CENTER_TEXT_HEIGHT, justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: DURATION_FONT_SIZE,
                fontWeight: '600',
                letterSpacing: 1,
                color: foreground,
                fontFamily: 'Inter-SemiBold',
                textAlign: 'center',
              }}
            >
              {centerText}
            </Text>
          </View>
        </TimerProgressRing>

        <View style={{ height: CONTROLS_SPACING }} />

        <View style={{ height: CONTROLS_HEIGHT, justifyContent: 'center' }}>
          {showPlayPause ? (
            <Pressable
              onPress={handleTogglePause}
              disabled={phase === 'finished'}
              style={{
                width: CONTROLS_HEIGHT,
                height: CONTROLS_HEIGHT,
                alignItems: 'center',
                justifyContent: 'center',
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
        style={{
          paddingHorizontal: 24,
          paddingBottom: 32,
          minHeight: FOOTER_MIN_HEIGHT,
          opacity: showFooter ? 1 : 0,
        }}
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
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: foreground,
                fontFamily: 'Inter-Regular',
              }}
            >
              {t('timers.finish')}
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 16 }} />

        <View style={{ opacity: showDiscard ? 1 : 0 }} pointerEvents={showDiscard ? 'auto' : 'none'}>
          <Pressable onPress={handleDiscard} style={{ alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: foreground,
                fontFamily: 'Inter-Regular',
              }}
            >
              {t('timers.discard_session')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
