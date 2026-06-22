import '@/lib/i18n';
import { ArrowLeftIcon } from '@/components/home/HomeIcon';
import { AppColors } from '@/constants/app-colors';
import { usePresetTimers } from '@/hooks/api/usePresetTimers';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { PresetTimer } from '@/types/timers';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function ActiveTimerModal({
  timer,
  visible,
  onClose,
}: {
  timer: PresetTimer | null;
  visible: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { foreground, cardSurface } = useThemeColors();
  const [remainingMs, setRemainingMs] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible || !timer) return;
    setRemainingMs(timer.durationMs);
    intervalRef.current = setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= 1000) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, timer]);

  if (!timer) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: cardSurface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 24,
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: foreground, fontFamily: 'Inter-SemiBold' }}>
            {timer.name}
          </Text>
          <Text style={{ fontSize: 64, fontWeight: '700', color: AppColors.blue, fontFamily: 'Inter-Bold' }}>
            {formatDuration(remainingMs)}
          </Text>
          <Text style={{ color: foreground, opacity: 0.7 }}>
            {remainingMs === 0 ? t('timers.complete') : t('timers.running')}
          </Text>
          <Pressable
            onPress={onClose}
            style={{
              marginTop: 8,
              borderRadius: 12,
              backgroundColor: AppColors.blue,
              paddingHorizontal: 24,
              paddingVertical: 12,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontFamily: 'Inter-Bold' }}>
              {t('timers.close')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function TimersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { foreground, mutedForeground, scaffoldBackground, cardSurface, cardBorder } =
    useThemeColors();
  const { data: timers = [], isLoading, isError, refetch } = usePresetTimers();
  const [activeTimer, setActiveTimer] = useState<PresetTimer | null>(null);

  const openTimer = useCallback((timer: PresetTimer) => {
    setActiveTimer(timer);
  }, []);

  const closeTimer = useCallback(() => {
    setActiveTimer(null);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <ArrowLeftIcon size={24} color={foreground} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: foreground,
            textAlign: 'center',
          }}
        >
          {t('timers.title')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : isError ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
          <Text style={{ color: mutedForeground, textAlign: 'center' }}>{t('home.load_error')}</Text>
          <Pressable
            onPress={() => void refetch()}
            style={{ backgroundColor: AppColors.blue, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Text style={{ color: '#fff' }}>{t('practice.retry')}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={timers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => openTimer(item)}
              style={({ pressed }) => ({
                borderRadius: 16,
                borderWidth: 1,
                borderColor: cardBorder,
                backgroundColor: cardSurface,
                padding: 20,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ fontSize: 18, fontWeight: '600', color: foreground, fontFamily: 'Inter-SemiBold' }}>
                {item.name}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 14, color: mutedForeground }}>
                {formatDuration(item.durationMs)}
              </Text>
            </Pressable>
          )}
        />
      )}

      <ActiveTimerModal timer={activeTimer} visible={activeTimer != null} onClose={closeTimer} />
    </View>
  );
}
