import { Text } from '@/components/ui/text';
import { APP_ASSETS } from '@/constants/app-assets';
import type { AppEvent } from '@/types/event';
import { formatEventDateRange } from '@/utils/event-parse';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable, View, type ImageStyle, type StyleProp } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface HomeEventCardProps {
  event: AppEvent;
  onPress?: () => void;
}

function EventCoverImage({
  imageUrl: coverUrl,
  style,
}: {
  imageUrl: string | null | undefined;
  style: StyleProp<ImageStyle>;
}) {
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
  }, [coverUrl]);

  const useFallback = !coverUrl || loadFailed;

  return (
    <Image
      source={useFallback ? APP_ASSETS.seriesCoverFallback : { uri: coverUrl }}
      style={style}
      contentFit="cover"
      onError={() => setLoadFailed(true)}
    />
  );
}

export function HomeEventCard({ event, onPress }: HomeEventCardProps) {
  const { cardSurface, cardBorder } = useThemeColors();
  const dateRange = formatEventDateRange(event);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row overflow-hidden rounded-2xl border active:opacity-92"
      style={{ borderColor: cardBorder, backgroundColor: cardSurface }}
    >
      <EventCoverImage
        imageUrl={event.imageUrl}
        style={{ width: 88, height: 88 }}
      />
      <View className="flex-1 justify-center gap-1 p-3">
        <Text className="text-[15px] font-semibold text-foreground" numberOfLines={2}>
          {event.name}
        </Text>
        {dateRange ? (
          <Text className="text-[13px] text-muted-foreground">{dateRange}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
