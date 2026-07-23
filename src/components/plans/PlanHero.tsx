import type { ImageSizes } from '@/types/api';
import { Text } from '@/components/ui/text';
import { imageUrl } from '@/utils/image-url';
import { Image } from 'expo-image';
import { useWindowDimensions, View } from 'react-native';

interface PlanHeroProps {
  title: string;
  image?: ImageSizes | null;
  totalDays: number;
  description?: string | null;
  variant?: 'preview' | 'track';
}

export function PlanHero({
  title,
  image,
  totalDays,
  description,
  variant = 'preview',
}: PlanHeroProps) {
  const { height: windowHeight } = useWindowDimensions();
  const daysLabel =
    totalDays === 1
      ? "1 day"
      : `${totalDays} days`;

  if (variant === 'track') {
    const heroHeight = Math.round(windowHeight * 0.3);
    return (
      <View className="px-4 pt-3">
        {image ? (
          <Image
            source={{ uri: imageUrl(image) }}
            style={{
              width: '100%',
              height: heroHeight,
              borderRadius: 12,
            }}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View
            className="w-full rounded-xl bg-[#e8e8e4]"
            style={{ height: heroHeight }}
          />
        )}
        {description ? (
          <Text className="text-sm text-[#333] leading-[22px] mt-4">{description}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View>
      {image ? (
        <Image
          source={{ uri: imageUrl(image) }}
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <View className="w-full aspect-video bg-[#e8e8e4]" />
      )}
      <View className="px-4 pt-5">
        <Text className="text-2xl font-bold text-foreground mb-1.5">{title}</Text>
        <Text className={`text-[13px] text-muted-foreground${description ? ' mb-3' : ''}`}>
          {daysLabel}
        </Text>
        {description ? (
          <Text className="text-sm text-[#333] leading-[22px]">{description}</Text>
        ) : null}
      </View>
    </View>
  );
}
