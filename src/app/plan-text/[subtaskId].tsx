import { PlanReadingLayout } from '@/components/plans/PlanReadingLayout';
import { usePlanReadingSession } from '@/hooks/usePlanReadingSession';
import { usePlanSegmentAudio } from '@/hooks/usePlanSegmentAudio';
import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function PlanTextScreen() {
  const { subtaskId } = useLocalSearchParams<{ subtaskId: string }>();
  const { t } = useTranslation();
  const cancelAudioRef = useRef<() => void>(() => {});

  const {
    isLoading,
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

  const content = subtask?.sub.content ?? currentItem?.content ?? '';

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
      sectionTitle={currentItem?.taskTitle ?? t('reader.title')}
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
    />
  );
}
