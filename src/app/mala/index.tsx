import '@/lib/i18n';
import { ArrowLeftIcon } from '@/components/home/HomeIcon';
import { AppColors } from '@/constants/app-colors';
import { StorageKeys, getString, setString } from '@/lib/storage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BEADS_PER_ROUND = 108;

interface MalaState {
  total: number;
  rounds: number;
  beadInRound: number;
}

function parseMalaState(raw: string | null): MalaState {
  if (!raw) return { total: 0, rounds: 0, beadInRound: 0 };
  try {
    const parsed = JSON.parse(raw) as MalaState;
    return {
      total: parsed.total ?? 0,
      rounds: parsed.rounds ?? 0,
      beadInRound: parsed.beadInRound ?? 0,
    };
  } catch {
    return { total: 0, rounds: 0, beadInRound: 0 };
  }
}

export default function MalaScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { foreground, mutedForeground, scaffoldBackground } = useThemeColors();
  const [state, setState] = useState<MalaState>({ total: 0, rounds: 0, beadInRound: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getString(StorageKeys.malaCounter).then((raw) => {
      setState(parseMalaState(raw));
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(async (next: MalaState) => {
    setState(next);
    await setString(StorageKeys.malaCounter, JSON.stringify(next));
  }, []);

  const increment = () => {
    const nextTotal = state.total + 1;
    const beadInRound = nextTotal % BEADS_PER_ROUND || (nextTotal > 0 ? BEADS_PER_ROUND : 0);
    const rounds = Math.floor(nextTotal / BEADS_PER_ROUND);
    void persist({ total: nextTotal, rounds, beadInRound });
  };

  const reset = () => {
    void persist({ total: 0, rounds: 0, beadInRound: 0 });
  };

  const displayBead = state.total === 0 ? 0 : state.beadInRound;

  return (
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <ArrowLeftIcon size={24} color={foreground} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: foreground,
            textAlign: 'center',
          }}
        >
          {t('mala.title')}
        </Text>
        <Pressable onPress={reset} style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
          <Text style={{ color: AppColors.blue, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
            {t('mala.reset')}
          </Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 14, color: mutedForeground, marginBottom: 8 }}>
          {t('mala.tap_to_count')}
        </Text>
        <Text
          style={{
            fontSize: 56,
            fontWeight: '700',
            fontFamily: 'Inter-Bold',
            color: foreground,
            opacity: loaded ? 1 : 0.4,
          }}
        >
          {displayBead}/{BEADS_PER_ROUND}
        </Text>
        <Text style={{ marginTop: 8, fontSize: 20, color: mutedForeground }}>
          {t('mala.rounds', { count: state.rounds })}
        </Text>

        <Pressable
          onPress={increment}
          style={({ pressed }) => ({
            marginTop: 48,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: AppColors.blue,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.9 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel={t('mala.tap_to_count')}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
            +1
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
