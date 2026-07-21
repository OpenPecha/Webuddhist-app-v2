import type { Series } from '@/types/series';
import { imageUrl } from '@/utils/image-url';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SeriesCardProps {
  series: Series;
  onPress?: () => void;
}

export function SeriesCard({ series, onPress }: SeriesCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) return onPress();
    router.push(`/series/${series.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="aspect-[1.3] overflow-hidden rounded-2xl active:opacity-80"
    >
      <Image
        source={{ uri: imageUrl(series.image) }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        locations={[0.6, 1.0]}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      <View className="absolute bottom-0 left-0 right-0 p-2">
        <Text
          className="text-white text-sm font-black text-center"
          numberOfLines={2}
          style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4 }}
        >
          {series.metadata?.title}
        </Text>
      </View>
    </Pressable>
  );
}
