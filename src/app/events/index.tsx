import { Text } from '@/components/ui/text';
import { ArrowLeftIcon } from '@/components/home/HomeIcon';
import { HomeEventCard } from '@/components/home/HomeEventCard';
import { useEventsToday } from '@/hooks/api/useEventsToday';
import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/utils/cn';
import type { AppEvent } from '@/types/event';
import { useRouter, type Href } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslate } from '@tolgee/react';

const EVENTS_LIST_LIMIT = 20;

function navigateToEvent(router: ReturnType<typeof useRouter>, event: AppEvent) {
  if (event.planId) {
    router.push({
      pathname: '/practice/details',
      params: { planId: event.planId, title: event.name },
    } as Href);
  }
}

export default function EventsScreen() {
  const { t } = useTranslate();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { foreground, isDark } = useThemeColors();
  const { data, isLoading, isError } = useEventsToday(EVENTS_LIST_LIMIT);

  return (
    <View className={cn('flex-1', isDark ? 'bg-black' : 'bg-[#FBF9F4]')} style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="active:opacity-70"
          accessibilityRole="button"
        >
          <ArrowLeftIcon size={24} color={foreground} />
        </Pressable>
        <Text className="flex-1 text-xl font-bold text-foreground">{t('calendar_upcoming_events')}</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : isError || !data || data.events.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-muted-foreground">{t('no_content')}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {data.events.map((event) => (
            <HomeEventCard
              key={event.id}
              event={event}
              onPress={() => navigateToEvent(router, event)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
