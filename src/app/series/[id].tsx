import { PlanCard } from '@/components/ui/molecules/cards/plan-card';
import { useSeriesById } from '@/hooks/useSeries';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native';


export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: series, isLoading, error } = useSeriesById(id!);

  const metadata = series?.metadata[0];

  return (
    <>
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}

      {error && (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-destructive text-center">
            Failed to load series
          </Text>
        </View>
      )}

      {series && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: series.image }}
            style={{ height: 250, width: '100%' }}
            contentFit="cover"
            transition={300}
          />

          <View className="gap-4 p-4">
            <View>
              <Text className="text-foreground text-lg font-bold">
                {metadata?.title}
              </Text>
              {metadata?.description ? (
                <Text className="text-muted-foreground text-sm">
                  {metadata.description}
                </Text>
              ) : null}
            </View>

            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="calendar-month" size={14} color="gray" />
                <Text className="text-muted-foreground text-xs">
                  {series.total_days} {series.total_days === 1 ? 'day' : 'days'}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="list" size={14} color="gray" />
                <Text className="text-muted-foreground text-xs">
                  {series.plans.length} {series.plans.length === 1 ? 'plan' : 'plans'}
                </Text>
              </View>
            </View>

            {series.plans.length > 0 && (
              <View className="gap-2">
                {series.plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
}
