import { ArrowLeftIcon } from '@/components/home/HomeIcon';
import { PresetTimerCard } from '@/components/timer/PresetTimerCard';
import { PresetTimersGridSkeleton } from '@/components/timer/PresetTimersGridSkeleton';
import { usePresetTimers } from '@/hooks/api/usePresetTimers';
import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/utils/cn';
import { sortPresetTimers } from '@/utils/timers';
import type { PresetTimer } from '@/types/timers';
import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import { Text } from '@/components/ui/text';
import {
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GRID_SPACING = 12;
const HORIZONTAL_PADDING = 16;

export function PresetTimersView() {
  const { t } = useTranslate();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { foreground, isDark } = useThemeColors();
  const { data: timers = [], isLoading, isError, refetch, isRefetching } = usePresetTimers();

  const sortedTimers = useMemo(() => sortPresetTimers(timers), [timers]);

  const openActiveTimer = (timer: PresetTimer) => {
    router.push({
      pathname: '/timers/active',
      params: {
        id: timer.id,
        durationMs: String(timer.durationMs),
        name: timer.name,
      },
    } as Href);
  };

  return (
    <View className={cn('flex-1', isDark ? 'bg-black' : 'bg-[#FBF9F4]')} style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-2 py-1">
        <Pressable onPress={() => router.back()} className="h-12 w-12 justify-center p-2 active:opacity-70">
          <ArrowLeftIcon size={24} color={foreground} />
        </Pressable>
        <Text
          className="flex-1 text-center text-xl font-bold text-foreground"
          numberOfLines={1}
        >
          {t('meditation_timer')}
        </Text>
        <View className="h-12 w-12" />
      </View>

      {isLoading ? (
        <PresetTimersGridSkeleton />
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 p-6">
          <Text className="text-center text-muted-foreground">
            {t('session_timers_load_error')}
          </Text>
          <Pressable
            onPress={() => void refetch()}
            className="rounded-lg bg-[#0C53C5] px-4 py-2 active:opacity-70"
          >
            <Text className="text-white">{t('retry')}</Text>
          </Pressable>
        </View>
      ) : sortedTimers.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-center text-muted-foreground">
            {t('session_no_timers')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedTimers}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: GRID_SPACING }}
          contentContainerStyle={{
            padding: HORIZONTAL_PADDING,
          }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
          }
          renderItem={({ item }) => (
            <View className="flex-1">
              <PresetTimerCard
                timer={item}
                minLabel={t('timer_min')}
                onPress={() => openActiveTimer(item)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}
