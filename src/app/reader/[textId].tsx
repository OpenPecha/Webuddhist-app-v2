import { PlanReadingLayout } from '@/components/plans/PlanReadingLayout';
import { useTextReaderDetails } from '@/hooks/api/useTextReaderDetails';
import { usePlanReadingSession } from '@/hooks/usePlanReadingSession';
import { usePlanSegmentAudio } from '@/hooks/usePlanSegmentAudio';
import { resolveInitialSegmentId } from '@/utils/plan-subtask-navigation';
import { extractSegmentContent } from '@/utils/text-reader-content';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
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
    handlePrev,
    handleNext,
    handleFinish,
    navigate,
    tasks,
  } = usePlanReadingSession({ onBeforeNavigate: () => cancelAudioRef.current() });

  const audio = usePlanSegmentAudio({
    subTaskId: currentItem?.subTaskId,
    url: resolveAudioUrl(currentItem),
    startMs: currentItem?.startMs,
    endMs: currentItem?.endMs,
    autoPlay,
  });
  cancelAudioRef.current = audio.cancel;

  const subtaskContent = tasks
    .flatMap((task) => task.subtasks)
    .find((sub) => sub.id === currentItem?.subTaskId)?.content;

  const hasPlanContext = !!currentItem;
  const isSourceReference = currentItem?.contentType === 'SOURCE_REFERENCE';
  const inlineContent = subtaskContent?.trim() ?? currentItem?.content?.trim() ?? '';
  const needsReaderFetch = hasPlanContext && isSourceReference && !inlineContent;

  const segmentId = currentItem ? resolveInitialSegmentId(currentItem) : undefined;

  const { data: readerDetails, isLoading: readerLoading } = useTextReaderDetails(
    textId,
    segmentId,
    needsReaderFetch || (!hasPlanContext && !!textId),
  );

  const segmentContent = useMemo(() => {
    if (!readerDetails) return '';
    return extractSegmentContent(readerDetails, currentItem?.segmentIds);
  }, [readerDetails, currentItem?.segmentIds]);

  const content =
    inlineContent ||
    segmentContent ||
    readerDetails?.text_detail?.summary?.trim() ||
    t('reader.placeholder');

  const isLoading = planLoading || (needsReaderFetch && readerLoading);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F8F4' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasPlanContext) {
    return (
      <PlanReadingLayout
        content={content}
        sectionTitle={readerDetails?.text_detail?.title ?? t('reader.title')}
        canPrev={false}
        canNext={false}
        onFinish={() => router.back()}
      />
    );
  }

  return (
    <PlanReadingLayout
      content={content}
      sectionTitle={currentItem?.taskTitle ?? readerDetails?.text_detail?.title ?? t('reader.title')}
      audioReady={audio.ready}
      isPlaying={audio.isPlaying}
      isAudioLoading={audio.buttonState === 'loading'}
      onAudioToggle={audio.toggle}
      onBeforeBack={audio.cancel}
      canPrev={canPrev}
      canNext={canNext}
      onPrev={handlePrev}
      onNext={handleNext}
      onFinish={handleFinish}
      onSwipeNext={() => navigate('next')}
      onSwipePrev={() => navigate('prev')}
      footerMeta={
        readerDetails?.text_detail?.title ? (
          <Text style={{ fontSize: 11, color: '#8a8a8a', textAlign: 'center', marginTop: 16 }}>
            {readerDetails.text_detail.title}
          </Text>
        ) : null
      }
    />
  );
}
