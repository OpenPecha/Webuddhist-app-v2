import '@/lib/i18n';
import { useUserPlans } from '@/hooks/api/useUserPlans';
import { setPendingRoutineItem } from '@/stores/edit-routine-selection';
import type { UserPlan } from '@/types/plans';
import type { RoutineItem } from '@/types/routine';
import { routineItemCoverUri } from '@/components/practice/RoutineItemCard';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SelectPlanScreen() {
  const { blockLocalId } = useLocalSearchParams<{ blockLocalId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, isLoading } = useUserPlans();

  const onSelect = (plan: UserPlan) => {
    const item: RoutineItem = {
      id: plan.id,
      title: plan.title,
      coverImage: plan.image,
      imageUrl: plan.image_url,
      type: 'plan',
      language: plan.language,
      enrolledAt: plan.started_at,
      startDate: plan.start_date,
    };
    setPendingRoutineItem(blockLocalId, item);
    router.back();
  };

  const plans = data?.plans ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center' }}>
          {t('editRoutine.select_plan_title')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#8a8a8a', marginTop: 24 }}>
              {t('editRoutine.no_plans')}
            </Text>
          }
          renderItem={({ item }) => {
            const coverUri = routineItemCoverUri(item.image, item.image_url);
            return (
              <Pressable
                onPress={() => onSelect(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  gap: 12,
                }}
              >
                {coverUri ? (
                  <Image
                    source={{ uri: coverUri }}
                    style={{ width: 56, height: 56, borderRadius: 8 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 8,
                      backgroundColor: '#f0f0ec',
                    }}
                  />
                )}
                <Text style={{ flex: 1, fontSize: 16, fontWeight: '500' }}>{item.title}</Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
