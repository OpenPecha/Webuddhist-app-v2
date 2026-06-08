import type { Series } from '@/hooks/useSeries';
import { imageUrl } from '@/lib/image-url';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface SeriesCardProps {
  series: Series;
  onPress?: () => void;
}

export function SeriesCard({ series, onPress }: SeriesCardProps) {
  const router = useRouter();
  const metadata = series.metadata;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push(`/series/${series.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className=" w-72 self-start overflow-hidden rounded-2xl active:opacity-80"
    >
      <Image
        source={{ uri: imageUrl(series.image) }}
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
