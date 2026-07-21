import { PlanReadingLayout } from '@/components/plans/PlanReadingLayout';
import { useTextReaderDetails } from '@/hooks/api/useTextReaderDetails';
import { usePlanReadingSession } from '@/hooks/usePlanReadingSession';
import { usePlanSegmentAudio } from '@/hooks/usePlanSegmentAudio';
import { resolveInitialSegmentId } from '@/utils/plan-subtask-navigation';
import { extractSegmentContent, flattenReaderSegments } from '@/utils/text-reader-content';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useRef } from 'react';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, View } from 'react-native';
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
    onSegmentComplete: () => {
      if (canNext) {
        void navigate('next', { autoPlay: true });
      } else {
        void navigate('finish');
      }
    },
  });
  cancelAudioRef.current = audio.cancel;

  const subtask = tasks
    .flatMap((task) => task.subtasks.map((sub) => ({ sub, task })))
    .find(({ sub }) => sub.id === subtaskId);

  const contentMode = currentItem?.contentType === 'IMAGE' ? 'image' : 'markdown';
  const imageUrl = (currentItem?.imageUrl ?? subtask?.sub.content ?? '').trim();
  const inlineContent = subtask?.sub.content?.trim() ?? currentItem?.content?.trim() ?? '';
  const textId = subtask?.sub.source_text_id ?? currentItem?.sourceTextId ?? undefined;
  const segmentId = currentItem ? resolveInitialSegmentId(currentItem) : undefined;
  const needsReaderFetch = contentMode !== 'image' && !!textId;

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
    (contentMode === 'image' ? imageUrl : '') ||
    (segments ? segmentContent : '') ||
    inlineContent ||
    readerDetails?.text_detail?.summary?.trim() ||
    '';

  const textTitle = readerDetails?.text_detail?.title ?? t('reader.title');
  const isLoading = planLoading || (needsReaderFetch && readerLoading);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F8F4]">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!content) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F8F4] p-6">
        <Text className="text-center text-muted-foreground">{t('planTrack.no_tasks')}</Text>
      </View>
    );
  }

  return (
    <PlanReadingLayout
      variant="planText"
      content={content}
      contentMode={contentMode}
      sectionTitle={currentItem?.taskTitle ?? textTitle}
      textId={textId}
      segments={segments}
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
