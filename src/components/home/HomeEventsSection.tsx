import { Text } from '@/components/ui/text';
import { HomeEventCard } from '@/components/home/HomeEventCard';
import { HomeEventsSectionSkeleton } from '@/components/home/HomeEventsSectionSkeleton';
import { useEventsToday } from '@/hooks/api/useEventsToday';
import type { AppEvent } from '@/types/event';
import { cn } from '@/utils/cn';
import { useRouter, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

const HOME_EVENTS_PREVIEW_LIMIT = 3;

function navigateToEvent(router: ReturnType<typeof useRouter>, event: AppEvent) {
  if (event.planId) {
    router.push({
      pathname: '/practice/details',
      params: { planId: event.planId, title: event.name },
    } as Href);
  }
}

export function HomeEventsSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading, isError } = useEventsToday(HOME_EVENTS_PREVIEW_LIMIT);

  if (isLoading) return <HomeEventsSectionSkeleton />;
  if (isError || !data || data.events.length === 0) return null;

  const events = data.events;

  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-foreground">{t('home.events_title')}</Text>
        <Pressable
          onPress={() => router.push('/events' as Href)}
          className="active:opacity-70"
          accessibilityRole="button"
        >
          <Text className="text-sm text-muted-foreground">{t('home.events_see_all')}</Text>
        </Pressable>
      </View>

      <View className="h-4" />

      {events.map((event, index) => (
        <View
          key={event.id}
          className={cn(index < events.length - 1 && 'mb-3')}
        >
          <HomeEventCard
            event={event}
            onPress={() => navigateToEvent(router, event)}
          />
        </View>
      ))}
    </View>
  );
}
