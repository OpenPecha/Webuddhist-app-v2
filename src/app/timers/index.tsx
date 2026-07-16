import '@/lib/i18n';
import { ArrowLeftIcon } from '@/components/home/HomeIcon';
import { PresetTimerCard } from '@/components/timer/PresetTimerCard';
import { PresetTimersGridSkeleton } from '@/components/timer/PresetTimersGridSkeleton';
import { AppColors } from '@/constants/app-colors';
import { usePresetTimers } from '@/hooks/api/usePresetTimers';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { PresetTimer } from '@/types/timers';
import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

function sortPresetTimers(timers: PresetTimer[]): PresetTimer[] {
  return [...timers].sort((a, b) => a.durationMs - b.durationMs);
}

export default function TimersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { foreground, scaffoldBackground } = useThemeColors();
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
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8, width: 48, height: 48, justifyContent: 'center' }}>
          <ArrowLeftIcon size={24} color={foreground} />
        </Pressable>
        <Text
          className="flex-1 text-center text-xl font-bold text-foreground"
          numberOfLines={1}
        >
          {t('timers.meditation_timer')}
        </Text>
        <View style={{ width: 48, height: 48 }} />
      </View>

      {isLoading ? (
        <PresetTimersGridSkeleton />
      ) : isError ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
          <Text className="text-center text-muted-foreground">
            {t('timers.load_error')}
          </Text>
          <Pressable
            onPress={() => void refetch()}
            style={{ backgroundColor: AppColors.blue, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Text className="text-white">{t('practice.retry')}</Text>
          </Pressable>
        </View>
      ) : sortedTimers.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text className="text-center text-muted-foreground">
            {t('timers.no_timers')}
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
            gap: GRID_SPACING,
          }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
          }
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <PresetTimerCard
                timer={item}
                minLabel={t('timers.min')}
                onPress={() => openActiveTimer(item)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}
