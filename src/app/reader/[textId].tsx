import { PlanReadingLayout } from '@/components/plans/PlanReadingLayout';
import { ReaderBookmarkButton } from '@/components/reader/ReaderBookmarkButton';
import { useTextReaderDetails } from '@/hooks/api/useTextReaderDetails';
import { usePlanReadingSession } from '@/hooks/usePlanReadingSession';
import { usePlanSegmentAudio } from '@/hooks/usePlanSegmentAudio';
import { resolveInitialSegmentId } from '@/utils/plan-subtask-navigation';
import { extractSegmentContent, flattenReaderSegments } from '@/utils/text-reader-content';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef } from 'react';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ReaderScreen() {
  const { textId } = useLocalSearchParams<{ textId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const cancelAudioRef = useRef<() => void>(() => {});

  const {
    isLoading: planLoading,
    currentItem,
    resolveAudioUrl,
    autoPlay,
    canPrev,
    canNext,
    navigate,
    tasks,
  } = usePlanReadingSession({ onBeforeNavigate: () => cancelAudioRef.current() });

  const audio = usePlanSegmentAudio({
    subTaskId: currentItem?.subTaskId,
    url: resolveAudioUrl(currentItem),
    startMs: currentItem?.startMs,
    endMs: currentItem?.endMs,
    autoPlay,
    onSegmentComplete: () => {
      if (canNext) {
        void navigate('next', { autoPlay: true });
      } else {
        void navigate('finish');
      }
    },
  });
  cancelAudioRef.current = audio.cancel;

  const subtaskContent = tasks
    .flatMap((task) => task.subtasks)
    .find((sub) => sub.id === currentItem?.subTaskId)?.content;

  const hasPlanContext = !!currentItem;
  const inlineContent = subtaskContent?.trim() ?? currentItem?.content?.trim() ?? '';
  const needsReaderFetch = !!textId;
  const collapsedSegmentPreview = !!currentItem?.segmentIds?.length;

  const segmentId = currentItem ? resolveInitialSegmentId(currentItem) : undefined;

  const { data: readerDetails, isLoading: readerLoading } = useTextReaderDetails(
    textId!,
    segmentId,
    needsReaderFetch,
  );

  const segments = useMemo(() => {
    if (!readerDetails || !textId) return undefined;
    const flat = flattenReaderSegments(readerDetails);
    return flat.length > 0 ? flat : undefined;
  }, [readerDetails, textId]);

  const segmentContent = useMemo(() => {
    if (!readerDetails) return '';
    return extractSegmentContent(readerDetails, currentItem?.segmentIds);
  }, [readerDetails, currentItem?.segmentIds]);

  const content =
    (segments ? segmentContent : '') ||
    inlineContent ||
    readerDetails?.text_detail?.summary?.trim() ||
    t('reader.placeholder');

  const textTitle = readerDetails?.text_detail?.title ?? t('reader.title');
  const isLoading = planLoading || (needsReaderFetch && readerLoading);

  const bookmarkHeader = textId ? (
    <ReaderBookmarkButton textId={textId} textTitle={textTitle} />
  ) : null;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F8F4]">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasPlanContext) {
    return (
      <PlanReadingLayout
        variant="reader"
        content={content}
        sectionTitle={textTitle}
        textId={textId}
        segments={segments}
        headerExtra={bookmarkHeader}
        canPrev={false}
        canNext={false}
        onFinish={() => router.back()}
      />
    );
  }

  return (
    <PlanReadingLayout
      variant="reader"
      content={content}
      sectionTitle={currentItem?.taskTitle ?? textTitle}
      textId={textId}
      segments={segments}
      headerExtra={bookmarkHeader}
      audioReady={audio.ready}
      isPlaying={audio.isPlaying}
      isAudioLoading={audio.buttonState === 'loading'}
      onAudioToggle={audio.toggle}
      onBeforeBack={audio.cancel}
      canPrev={canPrev}
      canNext={canNext}
      onPrev={() => navigate('prev')}
      onNext={() => navigate('next')}
      onFinish={() => navigate('finish')}
      onSwipeNext={() => navigate('next')}
      onSwipePrev={() => navigate('prev')}
      collapsedSegmentPreview={collapsedSegmentPreview}
      activeSegmentIds={currentItem?.segmentIds}
      footerMeta={
        readerDetails?.text_detail?.title ? (
          <Text className="mt-4 text-center text-[11px] text-muted-foreground">
            {readerDetails.text_detail.title}
          </Text>
        ) : null
      }
    />
  );
}
