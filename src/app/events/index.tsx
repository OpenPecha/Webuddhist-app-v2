import '@/lib/i18n';
import { Text } from '@/components/ui/text';
import { ArrowLeftIcon } from '@/components/home/HomeIcon';
import { HomeEventCard } from '@/components/home/HomeEventCard';
import { useEventsToday } from '@/hooks/api/useEventsToday';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { AppEvent } from '@/types/event';
import { useRouter, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { foreground, scaffoldBackground } = useThemeColors();
  const { data, isLoading, isError } = useEventsToday(EVENTS_LIST_LIMIT);

  return (
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          accessibilityRole="button"
        >
          <ArrowLeftIcon size={24} color={foreground} />
        </Pressable>
        <Text className="flex-1 text-xl font-bold text-foreground">{t('home.events_title')}</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : isError || !data || data.events.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text className="text-center text-base text-muted-foreground">{t('home.events_empty')}</Text>
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
