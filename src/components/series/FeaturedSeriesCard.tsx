import type { Series } from '@/types/series';
import { imageUrl } from '@/utils/image-url';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface FeaturedSeriesCardProps {
  series: Series;
}

export function FeaturedSeriesCard({ series }: FeaturedSeriesCardProps) {
  const router = useRouter();
  const metadata = series.metadata;

  return (
    <Pressable
      onPress={() => router.push(`/series/${series.id}`)}
      className="rounded-2xl overflow-hidden bg-card active:opacity-90"
    >
      <Image
        source={{ uri: imageUrl(series.image) }}
        style={{ width: '100%', aspectRatio: 16 / 9 }}
        contentFit="cover"
        transition={300}
      />
      <View className="p-4 gap-1">
        <Text className="text-foreground text-lg font-bold" numberOfLines={2}>
          {metadata?.title}
        </Text>
        <Text className="text-muted-foreground text-sm" numberOfLines={1}>
          {[
            series.plan_count > 0 && `${series.plan_count} ${series.plan_count === 1 ? 'plan' : 'plans'}`,
            series.total_days > 0 && `${series.total_days} ${series.total_days === 1 ? 'day' : 'days'}`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </View>
    </Pressable>
  );
}
