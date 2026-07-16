import { Text } from '@/components/ui/text';
import { HomeEventCard } from '@/components/home/HomeEventCard';
import { HomeEventsSectionSkeleton } from '@/components/home/HomeEventsSectionSkeleton';
import { CARD_SPACING } from '@/components/home/constants';
import { useEventsToday } from '@/hooks/api/useEventsToday';
import type { AppEvent } from '@/types/event';
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
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text className="text-lg font-bold text-foreground">{t('home.events_title')}</Text>
        <Pressable
          onPress={() => router.push('/events' as Href)}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          accessibilityRole="button"
        >
          <Text className="text-sm text-muted-foreground">{t('home.events_see_all')}</Text>
        </Pressable>
      </View>

      <View style={{ height: CARD_SPACING }} />

      {events.map((event, index) => (
        <View
          key={event.id}
          style={{ marginBottom: index < events.length - 1 ? 12 : 0 }}
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
