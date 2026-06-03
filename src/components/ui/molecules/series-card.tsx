import type { Series } from '@/hooks/useSeries';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

interface SeriesCardProps {
  series: Series;
  onPress?: () => void;
}

export function SeriesCard({ series, onPress }: SeriesCardProps) {
  const metadata = series.metadata[0];

  return (
    <Pressable
      onPress={onPress}
      className=" w-72 self-start overflow-hidden rounded-2xl active:opacity-80"
    >
      <Image
        source={{ uri: series.image }}
        style={{ height: 128, width: '100%', borderRadius: 12 }}
        contentFit="cover"
        transition={200}
      />

      <View className="p-3">
        <Text
          className="text-foreground text-sm font-semibold"
          numberOfLines={2}
        >
          {metadata?.title}
        </Text>
        <Text
          className="text-muted-foreground mt-1 text-xs"
          numberOfLines={2}
        >
          {metadata?.description}
        </Text>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="calendar-month" size={12} color="gray" />
          <Text className="text-muted-foreground  text-xs">
            {series.plan_count} {series.plan_count === 1 ? 'plan' : 'plans'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
