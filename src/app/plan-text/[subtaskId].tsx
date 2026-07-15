import { PlanReadingLayout } from '@/components/plans/PlanReadingLayout';
import { ReaderBookmarkButton } from '@/components/reader/ReaderBookmarkButton';
import { useTextReaderDetails } from '@/hooks/api/useTextReaderDetails';
import { usePlanReadingSession } from '@/hooks/usePlanReadingSession';
import { usePlanSegmentAudio } from '@/hooks/usePlanSegmentAudio';
import { resolveInitialSegmentId } from '@/utils/plan-subtask-navigation';
import { extractSegmentContent, flattenReaderSegments } from '@/utils/text-reader-content';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function PlanTextScreen() {
  const { subtaskId } = useLocalSearchParams<{ subtaskId: string }>();
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
  });
  cancelAudioRef.current = audio.cancel;

  const subtask = tasks
    .flatMap((task) => task.subtasks.map((sub) => ({ sub, task })))
    .find(({ sub }) => sub.id === subtaskId);

  const inlineContent = subtask?.sub.content?.trim() ?? currentItem?.content?.trim() ?? '';
  const textId = subtask?.sub.source_text_id ?? currentItem?.sourceTextId ?? undefined;
  const segmentId = currentItem ? resolveInitialSegmentId(currentItem) : undefined;
  const needsReaderFetch = !!textId;

  const { data: readerDetails, isLoading: readerLoading } = useTextReaderDetails(
    textId ?? '',
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
    '';

  const textTitle = readerDetails?.text_detail?.title ?? t('reader.title');
  const isLoading = planLoading || (needsReaderFetch && readerLoading);
  const collapsedSegmentPreview = !!currentItem?.segmentIds?.length;

  const bookmarkHeader = textId ? (
    <ReaderBookmarkButton textId={textId} textTitle={textTitle} />
  ) : null;

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F8F4' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!content) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F8F4', padding: 24 }}>
        <Text style={{ color: '#8a8a8a', textAlign: 'center' }}>{t('planTrack.no_tasks')}</Text>
      </View>
    );
  }

  return (
    <PlanReadingLayout
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
          <Text style={{ fontSize: 11, color: '#8a8a8a', textAlign: 'center', marginTop: 16 }}>
            {readerDetails.text_detail.title}
          </Text>
        ) : null
      }
    />
  );
}
