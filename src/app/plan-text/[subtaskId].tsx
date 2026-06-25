import { PlanReadingLayout } from '@/components/plans/PlanReadingLayout';
import { usePlanReadingSession } from '@/hooks/usePlanReadingSession';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function PlanTextScreen() {
  const { subtaskId } = useLocalSearchParams<{ subtaskId: string }>();
  const { t } = useTranslation();
  const {
    isLoading,
    currentItem,
    resolveAudioUrl,
    autoPlay,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
    handleFinish,
    tasks,
  } = usePlanReadingSession();

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
      audioUrl={resolveAudioUrl(currentItem)}
      autoPlay={autoPlay}
      canPrev={canPrev}
      canNext={canNext}
      onPrev={handlePrev}
      onNext={handleNext}
      onFinish={handleFinish}
    />
  );
}
