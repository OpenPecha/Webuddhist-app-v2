import { Text } from '@/components/ui/text';
import { useOnboarding } from '@/providers/onboarding';
import { usePendingOnboardingPlan } from '@/providers/pending-onboarding-plan';
import type { UserPlan } from '@/types/plans';
import { cn } from '@/utils/cn';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../assets/images/webuddhist_gold.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ONBOARDING_EVENT = {
  planId: 'b42c9270-8bc9-4a98-b375-924a948ab18e',
  eventLabel: 'ITCC Bodhgaya · Dec 2026',
  planName: 'Daily Tipitaka',
  description: '200-Day Road to the International Tipitaka Chanting Ceremony 2026',
  totalDays: 6,
};

function GoldButton({ label, onPress, loading }: { label: string; onPress: () => void; loading?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full items-center rounded-xl bg-brand py-[18px] active:opacity-85"
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-lg font-semibold text-white">
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1, paddingHorizontal: 32,
        paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center">
        <Text className="text-[28px] font-medium text-white">
          {t('onboarding_welcome')}
        </Text>
        <Text className="text-4xl font-semibold text-white">
          {t('appTitle')}
        </Text>
      </View>

      <View className="my-8 min-h-[240px] flex-1 items-center justify-center">
        <Image source={logo} style={{ width: 200, height: 200 }} contentFit="contain" />
      </View>

      <View className="mb-10 gap-3">
        <Text className="text-center text-base font-medium leading-[26px] text-white">
          "{t('onboarding_quote')}"
        </Text>
        <Text className="text-center text-[15px] text-white/60">
          {t('onboarding_quote_citation')}
        </Text>
      </View>

      <GoldButton label={t('onboarding_find_peace')} onPress={onNext} />
    </ScrollView>
  );
}

function EventScreen({
  onNext,
  onBack,
  onSelectionChange,
}: {
  onNext: () => void;
  onBack: () => void;
  onSelectionChange: (selected: boolean) => void;
}) {
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
    onNext();
  };

  return (
    <View
      className="flex-1 px-8"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
    >
      <TouchableOpacity onPress={onBack} style={{ marginBottom: 40 }}>
        <Text className="text-[22px] text-white">←</Text>
      </TouchableOpacity>

      <Text className="mb-2 text-4xl font-bold leading-[42px] text-white">
        {t('onboarding_event_question')}
      </Text>
      <Text className="mb-9 text-[15px] text-white/50">
        {t('onboarding_event_optional')}
      </Text>

      <Pressable
        onPress={() => {
          setSelected((s) => {
            const next = !s;
            onSelectionChange(next);
            return next;
          });
        }}
        className={cn(
          'mb-4 flex-row items-center rounded-2xl p-4',
          selected
            ? 'border-2 border-brand bg-brand/10'
            : 'border-[1.5px] border-white/25 bg-transparent',
        )}
      >
        <View className="flex-1 gap-1.5">
          <View className="self-start rounded-md bg-brand/15 px-2 py-[3px]">
            <Text className="text-[11px] font-bold tracking-[0.6px] text-brand">
              {ONBOARDING_EVENT.eventLabel.toUpperCase()}
            </Text>
          </View>
          <Text className="text-[17px] font-semibold text-white">
            {ONBOARDING_EVENT.planName}
          </Text>
          <Text className="text-[13px] text-white/50">
            {t('onboarding_event_duration', { description: ONBOARDING_EVENT.description, days: ONBOARDING_EVENT.totalDays })}
          </Text>
        </View>

        <View
          className={cn(
            'ml-3 h-6 w-6 items-center justify-center rounded-full border-2',
            selected ? 'border-brand bg-brand' : 'border-white/40 bg-transparent',
          )}
        >
          {selected && <Text className="text-[13px] leading-[13px] text-white">✓</Text>}
        </View>
      </Pressable>

      <View className="flex-row items-start gap-1.5">
        <Text className="text-base text-white/40">🔔</Text>
        <Text className="flex-1 text-[13px] leading-5 text-white/40">
          {t('onboarding_event_reminder_note')}
        </Text>
      </View>

      <View className="flex-1" />
      <GoldButton label={t('onboarding_continue')} onPress={handleContinue} loading={loading} />
    </View>
  );
}

function AllSetScreen({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
    >
      <View className="flex-1 items-center justify-center gap-4">
        <Image source={logo} style={{ width: 80, height: 80 }} contentFit="contain" />
        <Text className="text-center text-[32px] font-semibold text-white">
          {t('appTitle')}
        </Text>
        <Text className="text-center text-[28px] italic leading-[38px] text-white">
          {t('onboarding_all_set')}
        </Text>
        <Text className="mt-1 text-center text-base leading-[26px] text-white/65">
          {t('onboarding_all_set_description')}
        </Text>
      </View>

      <GoldButton label={t('onboarding_begin_practice')} onPress={onComplete} />
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { markCompleted } = useOnboarding();
  const { setPendingPlan } = usePendingOnboardingPlan();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [eventEnrolled, setEventEnrolled] = useState(false);

  const goTo = (next: number) => {
    setPage(next);
    scrollRef.current?.scrollTo({ x: SCREEN_WIDTH * next, animated: true });
  };

  const handleComplete = async () => {
    if (eventEnrolled) {
      const pendingPlan: UserPlan = {
        id: ONBOARDING_EVENT.planId,
        title: ONBOARDING_EVENT.planName,
        description: ONBOARDING_EVENT.description,
        language: 'en',
        difficulty_level: null,
        image: null,
        started_at: new Date().toISOString(),
        total_days: ONBOARDING_EVENT.totalDays,
        start_date: null,
      };
      setPendingPlan(pendingPlan);
    }

    await markCompleted();
    router.replace('/');
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View className="flex-1" style={{ width: SCREEN_WIDTH }}>
          <WelcomeScreen onNext={() => goTo(1)} />
        </View>
        <View className="flex-1" style={{ width: SCREEN_WIDTH }}>
          <EventScreen
            onNext={() => goTo(2)}
            onBack={() => goTo(0)}
            onSelectionChange={setEventEnrolled}
          />
        </View>
        <View className="flex-1" style={{ width: SCREEN_WIDTH }}>
          <AllSetScreen onComplete={handleComplete} />
        </View>
      </ScrollView>
    </View>
  );
}
