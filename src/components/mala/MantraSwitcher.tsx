import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  mantraScript,
  mantraTransliteration,
  type Mantra,
} from '@/types/mala';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

interface MantraSwitcherProps {
  mantras: Mantra[];
  index: number;
  onIndexChange: (index: number) => void;
}

export function MantraSwitcher({ mantras, index, onIndexChange }: MantraSwitcherProps) {
  const { i18n } = useTranslation();
  const { foreground } = useThemeColors();
  const language = i18n.language.split('-')[0] ?? 'en';
  const canLoop = mantras.length > 1;
  const mantra = mantras[index];

  if (!mantra) return null;

  const script = mantraScript(mantra);
  const transliteration = mantraTransliteration(mantra);

  const goPrev = useCallback(() => {
    if (!canLoop) return;
    onIndexChange((index - 1 + mantras.length) % mantras.length);
  }, [canLoop, index, mantras.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (!canLoop) return;
    onIndexChange((index + 1) % mantras.length);
  }, [canLoop, index, mantras.length, onIndexChange]);

  const swipe = Gesture.Pan()
    .activeOffsetX([-16, 16])
    .failOffsetY([-20, 20])
    .onEnd((e) => {
      if (!canLoop) return;
      if (e.translationX <= -40 || e.velocityX <= -200) runOnJS(goNext)();
      else if (e.translationX >= 40 || e.velocityX >= 200) runOnJS(goPrev)();
    });

  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        onPress={goPrev}
        disabled={!canLoop}
        style={{ padding: 8, opacity: canLoop ? 1 : 0.3 }}
        accessibilityRole="button"
        accessibilityLabel="Previous mantra"
      >
        <CaretLeft size={24} color={foreground} />
      </Pressable>

      <GestureDetector gesture={swipe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 70 }}>
          {script ? (
            <Text
              className="text-center font-semibold text-foreground"
              style={{
                fontSize: language === 'bo' ? 26 : 22,
                lineHeight: language === 'bo' ? 34 : 30,
              }}
              numberOfLines={4}
            >
              {script}
            </Text>
          ) : null}
          {transliteration ? (
            <Text className="text-center text-[15px] text-muted-foreground" numberOfLines={2}>
              {transliteration}
            </Text>
          ) : null}
        </View>
      </GestureDetector>

      <Pressable
        onPress={goNext}
        disabled={!canLoop}
        style={{ padding: 8, opacity: canLoop ? 1 : 0.3 }}
        accessibilityRole="button"
        accessibilityLabel="Next mantra"
      >
        <CaretRight size={24} color={foreground} />
      </Pressable>
    </View>
  );
}
