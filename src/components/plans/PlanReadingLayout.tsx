import { MarkdownText } from '@/components/common/MarkdownText';
import { PlanNavigator } from '@/components/plans/PlanNavigator';
import { SWIPE_DISTANCE_RATIO, SWIPE_VELOCITY_THRESHOLD } from '@/constants/plan-reading';
import { useReaderFontSize } from '@/hooks/useReaderFontSize';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PREVIEW_LINE_LIMIT = 6;

interface PlanReadingLayoutProps {
  content: string;
  sectionTitle: string;
  audioReady?: boolean;
  isPlaying?: boolean;
  isAudioLoading?: boolean;
  onAudioToggle?: () => void;
  onBeforeBack?: () => void;
  canPrev: boolean;
  canNext: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  onSwipeNext?: () => void;
  onSwipePrev?: () => void;
  swipeEnabled?: boolean;
  headerExtra?: ReactNode;
  footerMeta?: ReactNode;
}

export function PlanReadingLayout({
  content,
  sectionTitle,
  audioReady,
  isPlaying,
  isAudioLoading,
  onAudioToggle,
  onBeforeBack,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onFinish,
  onSwipeNext,
  onSwipePrev,
  swipeEnabled,
  headerExtra,
  footerMeta,
}: PlanReadingLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const { fontSize, canDecrease, canIncrease, decrease, increase } = useReaderFontSize();
  const [dragOffset, setDragOffset] = useState(0);

  const screenWidth = Dimensions.get('window').width;
  const swipeDistanceThreshold = screenWidth * SWIPE_DISTANCE_RATIO;
  const gesturesActive =
    swipeEnabled !== false && (onSwipeNext != null || onSwipePrev != null);

  const canSwipeNext = canNext || !!onFinish;
  const canSwipePrev = canPrev;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          if (!gesturesActive) return false;
          const { dx, dy } = gestureState;
          return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
        },
        onPanResponderMove: (_, gestureState) => {
          setDragOffset(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dx, vx } = gestureState;
          const triggered =
            Math.abs(vx) >= SWIPE_VELOCITY_THRESHOLD ||
            Math.abs(dx) > swipeDistanceThreshold;

          if (triggered) {
            const swipeLeft = dx < 0 || vx < -SWIPE_VELOCITY_THRESHOLD;
            const swipeRight = dx > 0 || vx > SWIPE_VELOCITY_THRESHOLD;

            if (swipeLeft && canSwipeNext) {
              onSwipeNext?.();
            } else if (swipeRight && canSwipePrev) {
              onSwipePrev?.();
            }
          }

          setDragOffset(0);
        },
        onPanResponderTerminate: () => {
          setDragOffset(0);
        },
      }),
    [
      canSwipeNext,
      canSwipePrev,
      gesturesActive,
      onSwipeNext,
      onSwipePrev,
      swipeDistanceThreshold,
    ],
  );

  const lineCount = content.split('\n').length;
  const showReadFull = !expanded && lineCount > PREVIEW_LINE_LIMIT;
  const displayContent =
    showReadFull
      ? content.split('\n').slice(0, PREVIEW_LINE_LIMIT).join('\n')
      : content;

  const handleBack = () => {
    onBeforeBack?.();
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F8F4' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: insets.top + 4,
          paddingHorizontal: 8,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#e8e8e4',
        }}
      >
        <Pressable onPress={handleBack} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={decrease}
          disabled={!canDecrease}
          style={{ padding: 8, opacity: canDecrease ? 0.7 : 0.25 }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#000' }}>A</Text>
        </Pressable>
        <Pressable
          onPress={increase}
          disabled={!canIncrease}
          style={{ padding: 8, opacity: canIncrease ? 0.7 : 0.25 }}
        >
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#000' }}>A</Text>
        </Pressable>
        <Pressable disabled style={{ padding: 8, opacity: 0.35 }}>
          <Ionicons name="search" size={20} color="#000" />
        </Pressable>
        <Pressable disabled style={{ padding: 8, opacity: 0.35 }}>
          <Ionicons name="globe-outline" size={20} color="#000" />
        </Pressable>
        {headerExtra}
      </View>

      <View
        style={{ flex: 1, transform: [{ translateX: dragOffset * 0.25 }] }}
        {...(gesturesActive ? panResponder.panHandlers : {})}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: audioReady ? 120 : 80,
          }}
          showsVerticalScrollIndicator={false}
        >
          <MarkdownText
            content={displayContent}
            style={{
              fontSize,
              lineHeight: fontSize * 1.6,
              color: '#000',
              fontFamily: 'Georgia',
            }}
          />

          {showReadFull ? (
            <Pressable
              onPress={() => setExpanded(true)}
              style={{
                marginTop: 20,
                backgroundColor: '#e8e8e4',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000' }}>
                {t('reader.read_full_text')}
              </Text>
            </Pressable>
          ) : null}

          {footerMeta}

          {audioReady ? (
            <View style={{ alignItems: 'center', marginTop: 32 }}>
              <Pressable
                onPress={onAudioToggle}
                disabled={isAudioLoading}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  borderWidth: 1,
                  borderColor: '#000',
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isAudioLoading ? 0.6 : 1,
                }}
              >
                {isAudioLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={24}
                    color="#000"
                    style={!isPlaying ? { marginLeft: 3 } : undefined}
                  />
                )}
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </View>

      <View style={{ paddingBottom: insets.bottom }}>
        <PlanNavigator
          title={sectionTitle}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={onPrev}
          onNext={onNext}
          onFinish={onFinish}
        />
      </View>
    </View>
  );
}
