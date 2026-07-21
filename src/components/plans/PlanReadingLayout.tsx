import { MarkdownText } from '@/components/common/MarkdownText';
import { Text } from '@/components/ui/text';
import { PlanNavigator } from '@/components/plans/PlanNavigator';
import { ReaderFontSizeButton } from '@/components/reader/ReaderFontSizeButton';
import { ReaderFontSizeSheet } from '@/components/reader/ReaderFontSizeSheet';
import { ReaderSegmentList } from '@/components/reader/ReaderSegmentList';
import { SegmentActionSheet } from '@/components/reader/SegmentActionSheet';
import { SWIPE_DISTANCE_RATIO, SWIPE_VELOCITY_THRESHOLD } from '@/constants/plan-reading';
import { useReaderFontSize } from '@/hooks/useReaderFontSize';
import { useReaderSegmentSelection } from '@/hooks/useReaderSegmentSelection';
import { hapticSelection } from '@/utils/haptics';
import type { DetailTextSegment } from '@/types/texts';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  PanResponder,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PREVIEW_LINE_LIMIT = 6;

interface PlanReadingLayoutProps {
  variant: 'planText' | 'reader';
  content: string;
  contentMode?: 'markdown' | 'segments' | 'image';
  sectionTitle: string;
  textId?: string;
  segments?: DetailTextSegment[];
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
  collapsedSegmentPreview?: boolean;
  activeSegmentIds?: string[] | null;
}

export function PlanReadingLayout({
  variant,
  content,
  contentMode,
  sectionTitle,
  textId,
  segments,
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
  collapsedSegmentPreview = false,
  activeSegmentIds,
}: PlanReadingLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [fontSheetVisible, setFontSheetVisible] = useState(false);
  const { fontSize, canDecrease, canIncrease, decrease, increase } = useReaderFontSize();
  const [dragOffset, setDragOffset] = useState(0);

  const isReader = variant === 'reader';
  const allowCollapse = isReader && collapsedSegmentPreview;

  const resolvedContentMode = useMemo(() => {
    if (contentMode) return contentMode;
    return segments?.length && textId ? 'segments' : 'markdown';
  }, [contentMode, segments, textId]);
  const segmentMode = resolvedContentMode === 'segments';
  const imageMode = resolvedContentMode === 'image';
  const showFontControls = !imageMode;
  const { selected, selectedSegmentId, toggle, clear } = useReaderSegmentSelection(textId ?? '');

  const displaySegments = useMemo(() => {
    if (!segments?.length) return segments;
    if (allowCollapse && !expanded && activeSegmentIds?.length) {
      const active = new Set(activeSegmentIds.map(String));
      return segments.filter((s) => active.has(s.segment_id));
    }
    return segments;
  }, [segments, allowCollapse, expanded, activeSegmentIds]);

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
  const showReadFull =
    isReader && !expanded && lineCount > PREVIEW_LINE_LIMIT && !segmentMode && !imageMode;
  const displayContent =
    showReadFull ? content.split('\n').slice(0, PREVIEW_LINE_LIMIT).join('\n') : content;

  const previewSegmentLimit =
    allowCollapse && !expanded && segmentMode && displaySegments
      ? countPreviewSegments(displaySegments, PREVIEW_LINE_LIMIT)
      : undefined;

  const showSegmentReadFull =
    isReader &&
    allowCollapse &&
    !expanded &&
    segmentMode &&
    segments != null &&
    ((displaySegments != null &&
      previewSegmentLimit != null &&
      displaySegments.length > previewSegmentLimit) ||
      (!!activeSegmentIds?.length &&
        segments.length > (displaySegments?.length ?? 0)));

  const segmentListKey = segments?.map((s) => s.segment_id).join(',') ?? '';

  useEffect(() => {
    setExpanded(false);
    clear();
  }, [sectionTitle, segmentListKey, clear]);

  const handleBack = () => {
    onBeforeBack?.();
    clear();
    router.back();
  };

  const openFontSheet = () => {
    clear();
    setFontSheetVisible(true);
  };

  const handleSegmentPress = (segment: DetailTextSegment) => {
    if (!isReader) return;
    hapticSelection();
    toggle(segment);
  };

  return (
    <View className="flex-1 bg-[#F9F8F4]">
      <View
        className="flex-row items-center px-2 pb-2 border-b border-[#e8e8e4]"
        style={{ paddingTop: insets.top + 4 }}
      >
        <Pressable onPress={handleBack} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <View className="flex-1" />
        {isReader ? headerExtra : null}
        {isReader ? (
          <Pressable
            onPress={() => {
              clear();
              router.push('/reader/search');
            }}
            className="p-2"
            accessibilityRole="button"
            accessibilityLabel={t('home.search')}
          >
            <Ionicons name="search" size={20} color="#000" />
          </Pressable>
        ) : null}
        {showFontControls ? <ReaderFontSizeButton onPress={openFontSheet} /> : null}
        {isReader ? (
          <Pressable
            onPress={() => {
              clear();
              router.push('/reader/versions');
            }}
            className="p-2"
            accessibilityRole="button"
            accessibilityLabel={t('reader.version')}
          >
            <Ionicons name="globe-outline" size={20} color="#000" />
          </Pressable>
        ) : null}
      </View>

      <View
        className="flex-1"
        style={{ transform: [{ translateX: dragOffset * 0.25 }] }}
        {...(gesturesActive ? panResponder.panHandlers : {})}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: (audioReady ? 120 : 80) + (isReader && selected ? 120 : 0),
          }}
          showsVerticalScrollIndicator={false}
        >
          {segmentMode && displaySegments ? (
            <ReaderSegmentList
              segments={displaySegments}
              fontSize={fontSize}
              selectedSegmentId={isReader ? selectedSegmentId : null}
              onSegmentPress={handleSegmentPress}
              maxSegments={previewSegmentLimit}
            />
          ) : imageMode ? (
            <View className="w-full min-h-[280px]">
              <Image
                source={{ uri: content }}
                style={{ width: '100%', minHeight: 280, height: 420, borderRadius: 12 }}
                contentFit="contain"
                transition={150}
              />
            </View>
          ) : (
            <MarkdownText
              content={displayContent}
              style={{
                fontSize,
                lineHeight: fontSize * 1.6,
                color: '#000',
                fontFamily: 'Georgia',
              }}
            />
          )}

          {showReadFull || showSegmentReadFull ? (
            <Pressable
              onPress={() => setExpanded(true)}
              className="mt-5 bg-[#e8e8e4] rounded-xl py-3.5 items-center"
            >
              <Text className="text-[15px] font-bold text-foreground">{t('reader.read_full_text')}</Text>
            </Pressable>
          ) : null}

          {footerMeta}

          {audioReady ? (
            <View className="items-center mt-8">
              <Pressable
                onPress={onAudioToggle}
                disabled={isAudioLoading}
                className="w-14 h-14 rounded-full border border-black bg-white items-center justify-center"
                style={{ opacity: isAudioLoading ? 0.6 : 1 }}
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

      {showFontControls ? (
        <ReaderFontSizeSheet
          visible={fontSheetVisible}
          onClose={() => setFontSheetVisible(false)}
          fontSize={fontSize}
          canDecrease={canDecrease}
          canIncrease={canIncrease}
          onDecrease={decrease}
          onIncrease={increase}
        />
      ) : null}

      {isReader && selected ? <SegmentActionSheet selected={selected} onClose={clear} /> : null}
    </View>
  );
}

function countPreviewSegments(segments: DetailTextSegment[], lineLimit: number): number {
  let lines = 0;
  let count = 0;
  for (const segment of segments) {
    const segmentLines = (segment.content ?? '').split('\n').length;
    if (lines + segmentLines > lineLimit && count > 0) break;
    lines += segmentLines;
    count += 1;
  }
  return count || 1;
}
