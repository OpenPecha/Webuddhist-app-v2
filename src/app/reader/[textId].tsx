import { PlanReadingLayout } from '@/components/plans/PlanReadingLayout';
import { useTextDetail } from '@/hooks/api/useTextDetail';
import { usePlanReadingSession } from '@/hooks/usePlanReadingSession';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ReaderScreen() {
  const { textId } = useLocalSearchParams<{ textId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { data: textDetail, isLoading: textLoading } = useTextDetail(textId);

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
    tasks,
  } = usePlanReadingSession();

  const subtaskContent = tasks
    .flatMap((task) => task.subtasks)
    .find((sub) => sub.id === currentItem?.subTaskId)?.content;

  const content =
    subtaskContent?.trim() ||
    textDetail?.description?.trim() ||
    t('reader.placeholder');

  const isLoading = planLoading || textLoading;
  const hasPlanContext = !!currentItem;

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
        sectionTitle={textDetail?.title ?? t('reader.title')}
        canPrev={false}
        canNext={false}
        onFinish={() => router.back()}
      />
    );
  }

  return (
    <PlanReadingLayout
      content={content}
      sectionTitle={currentItem?.taskTitle ?? textDetail?.title ?? t('reader.title')}
      audioUrl={resolveAudioUrl(currentItem)}
      autoPlay={autoPlay}
      canPrev={canPrev}
      canNext={canNext}
      onPrev={handlePrev}
      onNext={handleNext}
      onFinish={handleFinish}
      footerMeta={
        textDetail?.title ? (
          <Text style={{ fontSize: 11, color: '#8a8a8a', textAlign: 'center', marginTop: 16 }}>
            {textDetail.title}
          </Text>
        ) : null
      }
    />
  );
}
