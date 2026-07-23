import { normalizeBeadImageUrl } from '@/lib/mala-bead-image';
import { MALA_BEADS_BOTTOM_INSET, MALA_BEADS_LAYOUT_HEIGHT } from '@/lib/mala-bead-geometry';
import { MalaBeadArcPlaceholder } from '@/components/mala/MalaBeadArcPlaceholder';
import { MalaBeads } from '@/components/mala/MalaBeads';
import { MalaCounterDisplay } from '@/components/mala/MalaCounterDisplay';
import { MalaSeedError } from '@/components/mala/MalaSeedError';
import { MalaSettingsSheet } from '@/components/mala/MalaSettingsSheet';
import { MalaSkeleton } from '@/components/mala/MalaSkeleton';
import { createMalaSoundPlayer } from '@/components/mala/MalaSoundPlayer';
import { MantraSwitcher } from '@/components/mala/MantraSwitcher';
import { ArrowLeftIcon } from '@/components/home/HomeIcon';
import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { DestructiveConfirmDialog } from '@/components/ui/DestructiveConfirmDialog';
import { useToggleBookmark } from '@/hooks/api/useToggleBookmark';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useGuest } from '@/providers/guest';
import { useMalaPresets } from '@/hooks/api/useMalaPresets';
import { useMalaCounter } from '@/hooks/useMalaCounter';
import { useMalaPreferences } from '@/hooks/useMalaPreferences';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAppLanguage } from '@/lib/tolgee';
import { cn } from '@/utils/cn';
import { localizedMantraName, type Mantra } from '@/types/mala';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { DotsThreeVerticalIcon } from 'phosphor-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const KEEP_AWAKE_TAG = 'mala-screen';

export default function MalaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { foreground, isDark } = useThemeColors();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const toggleBookmark = useToggleBookmark();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const language = useAppLanguage();

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
    : "Mala";

  const beadImageUrl =
    state.beadImageUrl ?? activeMantra?.beadImageUrl ?? activeMantra?.mantra?.beadImageUrl;

  const normalizedBeadUrl = normalizeBeadImageUrl(beadImageUrl);
  const beadsKey = `${activeMantra?.presetId}-${normalizedBeadUrl ?? 'gradient'}`;
  const [visualReadyKey, setVisualReadyKey] = useState<string | null>(null);
  const waitingForBeadTexture = Boolean(normalizedBeadUrl) && visualReadyKey !== beadsKey;

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
    <View className={cn('flex-1', isDark ? 'bg-black' : 'bg-[#FBF9F4]')} style={{ paddingTop: insets.top }}>
      {isLoading ? (
        <View className="p-1">
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 justify-center p-2 active:opacity-70"
          >
            <ArrowLeftIcon size={24} color={foreground} />
          </Pressable>
        </View>
      ) : (
        <View className="flex-row items-center px-1 py-0.5">
          <Pressable onPress={() => router.back()} className="h-12 w-12 justify-center p-2 active:opacity-70">
            <ArrowLeftIcon size={24} color={foreground} />
          </Pressable>
          <Text
            className="flex-1 text-center text-lg font-semibold text-foreground"
            numberOfLines={1}
          >
            {headerTitle}
          </Text>
          <Pressable
            onPress={() => setSettingsVisible(true)}
            className="h-12 w-12 items-center justify-center p-2 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel={"Mala options"}
          >
            <DotsThreeVerticalIcon size={30} color={foreground} />
          </Pressable>
        </View>
      )}

      {isLoading ? (
        <MalaSkeleton />
      ) : isError ? (
        <MalaSeedError onRetry={() => void refetch()} />
      ) : mantras.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-center text-foreground">
            {"No mantras available for your language."}
          </Text>
        </View>
      ) : (
        <View className="flex-1 px-6">
          <View className="min-h-10 flex-[0.4]">
            <MantraSwitcher mantras={mantras} index={index} onIndexChange={setIndex} />
          </View>

          <View className="flex-[0.6]">
            <MalaCounterDisplay
              beadInRound={state.beadInRound}
              rounds={state.rounds}
              loaded={!state.isSeeding}
            />

            {state.seedFailed ? (
              <MalaSeedError
                compact
                message={"Could not load your count."}
                onRetry={() => void seed()}
              />
            ) : (
              <View
                className="flex-1 justify-end"
                style={{ paddingBottom: MALA_BEADS_BOTTOM_INSET, minHeight: MALA_BEADS_LAYOUT_HEIGHT }}
              >
                {(state.isSeeding || waitingForBeadTexture) && <MalaBeadArcPlaceholder />}
                {!state.isSeeding && (
                  <View
                    style={
                      waitingForBeadTexture
                        ? {
                            opacity: 0,
                            position: 'absolute',
                            width: '100%',
                            bottom: MALA_BEADS_BOTTOM_INSET,
                          }
                        : undefined
                    }
                  >
                    <MalaBeads
                      key={beadsKey}
                      total={state.total}
                      beadImageUrl={beadImageUrl}
                      onVisualReady={() => setVisualReadyKey(beadsKey)}
                      onIncrement={handleIncrement}
                    />
                  </View>
                )}
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
        onBookmarkPress={() => {
          if (isGuest || !user) {
            showLoginDrawer();
            return;
          }
          if (!activeMantra?.presetId) return;
          toggleBookmark.mutate({
            type: 'ACCUMULATOR',
            sourceId: activeMantra.presetId,
            name: localizedMantraName(activeMantra, language),
          });
        }}
      />

      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />

      <DestructiveConfirmDialog
        visible={resetVisible}
        title={"Reset Mala?"}
        message={"Are you sure you want to reset the count for this Mala? This action cannot be undone."}
        confirmLabel={"Reset"}
        cancelLabel={"Cancel"}
        onConfirm={handleResetConfirm}
        onClose={() => setResetVisible(false)}
      />
    </View>
  );
}
