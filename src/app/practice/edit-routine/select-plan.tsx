import { useUserPlans } from '@/hooks/api/useUserPlans';
import { setPendingRoutineItem } from '@/stores/edit-routine-selection';
import type { UserPlan } from '@/types/plans';
import type { RoutineItem } from '@/types/routine';
import { routineItemCoverUri } from '@/components/practice/RoutineItemCard';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslate } from '@tolgee/react';

export default function SelectPlanScreen() {
  const { t } = useTranslate();
  const { blockLocalId } = useLocalSearchParams<{ blockLocalId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center p-2">
        <Pressable onPress={() => router.back()} className="p-2 active:opacity-70">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text className="flex-1 text-center text-[17px] font-semibold text-foreground">
          {t('routine_add_plan')}
        </Text>
        <View className="w-10" />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text className="mt-6 text-center text-muted-foreground">
              {t('no_plans_found')}
            </Text>
          }
          renderItem={({ item }) => {
            const coverUri = routineItemCoverUri(item.image, item.image_url);
            return (
              <Pressable
                onPress={() => onSelect(item)}
                className="flex-row items-center gap-3 py-3 active:opacity-70"
              >
                {coverUri ? (
                  <Image
                    source={{ uri: coverUri }}
                    style={{ width: 56, height: 56, borderRadius: 8 }}
                  />
                ) : (
                  <View className="h-14 w-14 rounded-lg bg-[#f0f0ec]" />
                )}
                <Text className="flex-1 text-base font-medium text-foreground">{item.title}</Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
