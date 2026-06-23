import '@/lib/i18n';
import { MalaBeads } from '@/components/mala/MalaBeads';
import { MalaCounterDisplay } from '@/components/mala/MalaCounterDisplay';
import { MalaSeedError } from '@/components/mala/MalaSeedError';
import { MalaSettingsSheet } from '@/components/mala/MalaSettingsSheet';
import { MalaSkeleton } from '@/components/mala/MalaSkeleton';
import { createMalaSoundPlayer } from '@/components/mala/MalaSoundPlayer';
import { MantraSwitcher } from '@/components/mala/MantraSwitcher';
import { ArrowLeftIcon } from '@/components/home/HomeIcon';
import { DestructiveConfirmDialog } from '@/components/ui/DestructiveConfirmDialog';
import { useMalaPresets } from '@/hooks/api/useMalaPresets';
import { useMalaCounter } from '@/hooks/useMalaCounter';
import { useMalaPreferences } from '@/hooks/useMalaPreferences';
import { useThemeColors } from '@/hooks/useThemeColors';
import { localizedMantraName, type Mantra } from '@/types/mala';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { DotsThreeVerticalIcon } from 'phosphor-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const KEEP_AWAKE_TAG = 'mala-screen';

export default function MalaScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { foreground, scaffoldBackground } = useThemeColors();
  const { user } = useAuth0();
  const language = i18n.language.split('-')[0] ?? 'en';

  const params = useLocalSearchParams<{ initialPresetId?: string; }>();
  const { data: mantras = [], isLoading, isError, refetch } = useMalaPresets();
  const {
    prefs,
    setSoundEnabled,
    setVibrationEnabled,
  } = useMalaPreferences();

  const [index, setIndex] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const soundRef = useRef<{ play: () => void; } | null>(null);

  useEffect(() => {
    void createMalaSoundPlayer().then((player) => {
      soundRef.current = player;
    });
  }, []);

  useEffect(() => {
    if (initialized || mantras.length === 0) return;
    if (params.initialPresetId) {
      const i = mantras.findIndex((m) => m.presetId === params.initialPresetId);
      if (i >= 0) setIndex(i);
    }
    setInitialized(true);
  }, [initialized, mantras, params.initialPresetId]);

  useFocusEffect(
    useCallback(() => {
      if (!prefs.screenLockEnabled) return;
      void activateKeepAwakeAsync(KEEP_AWAKE_TAG);
      return () => {
        deactivateKeepAwake(KEEP_AWAKE_TAG);
      };
    }, [prefs.screenLockEnabled]),
  );

  const activeMantra: Mantra | null = useMemo(() => {
    if (mantras.length === 0) return null;
    const safeIndex = Math.min(Math.max(index, 0), mantras.length - 1);
    return mantras[safeIndex] ?? null;
  }, [index, mantras]);

  const { state, seed, incrementBead, reset } = useMalaCounter(activeMantra, user ?? undefined);

  const headerTitle = activeMantra
    ? localizedMantraName(activeMantra, language)
    : t('mala.title');

  const beadImageUrl =
    state.beadImageUrl ?? activeMantra?.beadImageUrl ?? activeMantra?.mantra?.beadImageUrl;

  const handleIncrement = () => {
    void incrementBead({
      soundEnabled: prefs.soundEnabled,
      vibrationEnabled: prefs.vibrationEnabled,
      onSound: () => soundRef.current?.play(),
    });
  };

  const handleResetConfirm = () => {
    setResetVisible(false);
    void reset();
  };

  return (
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 4,
          paddingVertical: 2,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8, width: 48, height: 48, justifyContent: 'center' }}>
          <ArrowLeftIcon size={24} color={foreground} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: foreground,
            textAlign: 'center',
          }}
          numberOfLines={1}
        >
          {headerTitle}
        </Text>
        <Pressable
          onPress={() => setSettingsVisible(true)}
          style={{ padding: 8, width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={t('mala.settings_title')}
        >
          <DotsThreeVerticalIcon size={30} color={foreground} />
        </Pressable>
      </View>

      {isLoading ? (
        <MalaSkeleton />
      ) : isError ? (
        <MalaSeedError onRetry={() => void refetch()} />
      ) : mantras.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: foreground, fontFamily: 'Inter-Regular', textAlign: 'center' }}>
            {t('mala.no_mantras')}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <View style={{ flex: 0.4, minHeight: 40 }}>
            <MantraSwitcher mantras={mantras} index={index} onIndexChange={setIndex} />
          </View>

          <View style={{ flex: 0.6 }}>
            <MalaCounterDisplay
              beadInRound={state.beadInRound}
              rounds={state.rounds}
              loaded={!state.isSeeding}
            />

            {state.seedFailed ? (
              <MalaSeedError
                compact
                message={t('mala.seed_error')}
                onRetry={() => void seed()}
              />
            ) : (
              <View style={{
                flex: 1,
                justifyContent: 'flex-end', paddingBottom: 80, minHeight: 220
              }}>
                <MalaBeads
                  key={activeMantra?.presetId}
                  total={state.total}
                  beadImageUrl={beadImageUrl}
                  enabled={!state.isSeeding}
                  onIncrement={handleIncrement}
                />
              </View>
            )}
          </View>
        </View>
      )}

      <MalaSettingsSheet
        visible={settingsVisible}
        prefs={prefs}
        onClose={() => setSettingsVisible(false)}
        onResetPress={() => setResetVisible(true)}
        onSoundChange={(v) => void setSoundEnabled(v)}
        onVibrationChange={(v) => void setVibrationEnabled(v)}
      />

      <DestructiveConfirmDialog
        visible={resetVisible}
        title={t('mala.reset_title')}
        message={t('mala.reset_message')}
        confirmLabel={t('mala.reset_confirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleResetConfirm}
        onClose={() => setResetVisible(false)}
      />
    </View>
  );
}
