import { SeriesCard } from '@/components/series/SeriesCard';
import { useSeries } from '@/hooks/api/useSeries';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

export function Challenge() {
  const { data, isLoading, error } = useSeries();

  return (
    <>
      <View className="flex-row items-center">
        <Text className="text-foreground text-lg font-semibold">Challenges</Text>
        <Pressable className="p-2">
          <MaterialIcons name="arrow-forward-ios" size={12} />
        </Pressable>
      </View>

      {isLoading && (
        <View className="h-48 items-center justify-center">
          <ActivityIndicator size="small" />
        </View>
      )}

      {error && <Text className="text-destructive">Failed to load challenges</Text>}

      {data?.series && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3"
        >
          {data.series.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </ScrollView>
      )}
    </>
  );
}
