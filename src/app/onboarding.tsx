import { useOnboarding } from '@/providers/onboarding';
import '@/lib/i18n';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../assets/images/webuddhist_gold.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GOLD = '#DEAD2D';
const BG = '#000000';

const ONBOARDING_EVENT = {
  planId: 'b42c9270-8bc9-4a98-b375-924a948ab18e',
  eventLabel: 'ITCC Bodhgaya · Dec 2026',
  planName: 'Daily Tipitaka',
  description: '200-Day Road to the International Tipitaka Chanting Ceremony 2026',
  totalDays: 6,
};

// ─── Shared button ───────────────────────────────────────────────────────────

function GoldButton({ label, onPress, loading }: { label: string; onPress: () => void; loading?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: GOLD, borderRadius: 12, paddingVertical: 18,
        alignItems: 'center', opacity: pressed ? 0.85 : 1, width: '100%',
      })}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// ─── Screen 1: Welcome ───────────────────────────────────────────────────────

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1, paddingHorizontal: 32,
        paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '500', fontFamily: 'Inter-Regular' }}>
          {t('onboarding.welcome')}
        </Text>
        <Text style={{ color: '#fff', fontSize: 36, fontWeight: '600', fontFamily: 'Inter-Bold' }}>
          {t('appTitle')}
        </Text>
      </View>

      {/* Logo */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 240, marginVertical: 32 }}>
        <Image source={logo} style={{ width: 200, height: 200 }} contentFit="contain" />
      </View>

      {/* Quote */}
      <View style={{ marginBottom: 40, gap: 12 }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500', fontFamily: 'EBGaramond-Regular', textAlign: 'center', lineHeight: 26 }}>
          "{t('onboarding.quote')}"
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, textAlign: 'center', fontFamily: 'EBGaramond-Regular' }}>
          {t('onboarding.quote_citation')}
        </Text>
      </View>

      <GoldButton label={t('onboarding.get_started')} onPress={onNext} />
    </ScrollView>
  );
}

// ─── Screen 2: Event enrollment ──────────────────────────────────────────────

function EventScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { t } = useTranslation();
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
    <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}>
      {/* Back */}
      <TouchableOpacity onPress={onBack} style={{ marginBottom: 40 }}>
        <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={{ color: '#fff', fontSize: 36, fontWeight: '700', fontFamily: 'Inter-Bold', lineHeight: 42, marginBottom: 8 }}>
        {t('onboarding.event_question')}
      </Text>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 36 }}>
        {t('onboarding.event_optional')}
      </Text>

      {/* Event card */}
      <Pressable
        onPress={() => setSelected((s) => !s)}
        style={{
          borderRadius: 16,
          borderWidth: selected ? 2 : 1.5,
          borderColor: selected ? GOLD : 'rgba(255,255,255,0.25)',
          backgroundColor: selected ? 'rgba(222,173,45,0.1)' : 'transparent',
          padding: 16, marginBottom: 16,
          flexDirection: 'row', alignItems: 'center',
        }}
      >
        <View style={{ flex: 1, gap: 6 }}>
          {/* Badge */}
          <View style={{ backgroundColor: 'rgba(222,173,45,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}>
            <Text style={{ color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 }}>
              {ONBOARDING_EVENT.eventLabel.toUpperCase()}
            </Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>
            {ONBOARDING_EVENT.planName}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            {t('onboarding.event_duration', { description: ONBOARDING_EVENT.description, days: ONBOARDING_EVENT.totalDays })}
          </Text>
        </View>

        {/* Circle checkbox */}
        <View style={{
          width: 24, height: 24, borderRadius: 12,
          borderWidth: 2, borderColor: selected ? GOLD : 'rgba(255,255,255,0.4)',
          backgroundColor: selected ? GOLD : 'transparent',
          alignItems: 'center', justifyContent: 'center', marginLeft: 12,
        }}>
          {selected && <Text style={{ color: '#fff', fontSize: 13, lineHeight: 13 }}>✓</Text>}
        </View>
      </Pressable>

      {/* Reminder note */}
      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>🔔</Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, flex: 1, lineHeight: 20 }}>
          {t('onboarding.event_reminder')}
        </Text>
      </View>

      <View style={{ flex: 1 }} />
      <GoldButton label={t('onboarding.continue')} onPress={handleContinue} loading={loading} />
    </View>
  );
}

// ─── Screen 3: All set ────────────────────────────────────────────────────────

function AllSetScreen({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: insets.top, paddingBottom: insets.bottom + 24, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Image source={logo} style={{ width: 80, height: 80 }} contentFit="contain" />
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: '600', fontFamily: 'Inter-Bold', textAlign: 'center' }}>
          {t('appTitle')}
        </Text>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '400', fontStyle: 'italic', fontFamily: 'EBGaramond-Regular', textAlign: 'center', lineHeight: 38 }}>
          {t('onboarding.all_set')}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, textAlign: 'center', lineHeight: 26, marginTop: 4 }}>
          {t('onboarding.all_set_description')}
        </Text>
      </View>

      <GoldButton label={t('onboarding.begin_practice')} onPress={onComplete} />
    </View>
  );
}

// ─── Wrapper ─────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const router = useRouter();
  const { markCompleted } = useOnboarding();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const goTo = (next: number) => {
    setPage(next);
    scrollRef.current?.scrollTo({ x: SCREEN_WIDTH * next, animated: true });
  };

  const handleComplete = async () => {
    await markCompleted();
    router.replace('/');
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar style="light" />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
          <WelcomeScreen onNext={() => goTo(1)} />
        </View>
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
          <EventScreen onNext={() => goTo(2)} onBack={() => goTo(0)} />
        </View>
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
          <AllSetScreen onComplete={handleComplete} />
        </View>
      </ScrollView>
    </View>
  );
}
