import { useUserPlanDay, useUserPlanProgress } from '@/hooks/api/usePlanTrack';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlanTrackScreen() {
  const params = useLocalSearchParams<{
    planId: string;
    selectedDay?: string;
    title?: string;
  }>();
  const planId = params.planId;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const initialDay = useMemo(() => {
    const parsed = Number(params.selectedDay);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [params.selectedDay]);

  const [selectedDay, setSelectedDay] = useState(initialDay);

  const { data: progress, isLoading: progressLoading } = useUserPlanProgress(planId);
  const { data: dayDetails, isLoading: dayLoading } = useUserPlanDay(planId, selectedDay);

  const totalDays =
    progress?.plan?.total_days ??
    (dayDetails ? selectedDay : 1);
  const title = params.title ?? progress?.plan?.title ?? t('planTrack.title');

  const canGoPrev = selectedDay > 1;
  const canGoNext = selectedDay < totalDays;

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: '#000',
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingBottom: 12,
          gap: 16,
        }}
      >
        <Pressable
          disabled={!canGoPrev}
          onPress={() => setSelectedDay((d) => d - 1)}
          style={{ opacity: canGoPrev ? 1 : 0.3, padding: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color="#000" />
        </Pressable>
        <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
          {t('planTrack.day_of', { day: selectedDay, total: totalDays })}
        </Text>
        <Pressable
          disabled={!canGoNext}
          onPress={() => setSelectedDay((d) => d + 1)}
          style={{ opacity: canGoNext ? 1 : 0.3, padding: 8 }}
        >
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </Pressable>
      </View>

      {progressLoading || dayLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
          {(dayDetails?.tasks ?? []).length === 0 ? (
            <Text style={{ color: '#8a8a8a', textAlign: 'center', marginTop: 24 }}>
              {t('planTrack.no_tasks')}
            </Text>
          ) : (
            dayDetails?.tasks.map((task) => (
              <View
                key={task.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: '#e8e8e4',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    fontFamily: 'Inter-SemiBold',
                    marginBottom: 8,
                  }}
                >
                  {task.title}
                </Text>
                {task.sub_tasks.map((sub) => (
                  <Text
                    key={sub.id}
                    style={{ fontSize: 14, color: '#444', lineHeight: 20, marginTop: 4 }}
                    numberOfLines={4}
                  >
                    {sub.content}
                  </Text>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
