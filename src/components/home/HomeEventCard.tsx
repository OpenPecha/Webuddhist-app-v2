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
      style={({ pressed }) => ({
        flexDirection: 'row',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: cardBorder,
        backgroundColor: cardSurface,
        overflow: 'hidden',
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <EventCoverImage
        imageUrl={event.imageUrl}
        style={{ width: 88, height: 88 }}
      />
      <View style={{ flex: 1, padding: 12, justifyContent: 'center', gap: 4 }}>
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
