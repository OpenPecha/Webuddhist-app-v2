import { APP_ASSETS } from '@/constants/app-assets';
import type { AppEvent } from '@/types/event';
import { formatEventDateRange } from '@/utils/event-parse';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View, type ImageStyle, type StyleProp } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface HomeEventCardProps {
  event: AppEvent;
  onPress?: () => void;
}

function EventCoverImage({
  imageUrl,
  style,
}: {
  imageUrl: string | null | undefined;
  style: StyleProp<ImageStyle>;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <Image
      source={failed || !imageUrl ? APP_ASSETS.seriesCoverFallback : { uri: imageUrl }}
      style={style}
      contentFit="cover"
      onError={() => setFailed(true)}
    />
  );
}

export function HomeEventCard({ event, onPress }: HomeEventCardProps) {
  const { foreground, mutedForeground, cardSurface, cardBorder } = useThemeColors();
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
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: foreground,
          }}
          numberOfLines={2}
        >
          {event.name}
        </Text>
        {dateRange ? (
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Inter-Regular',
              color: mutedForeground,
            }}
          >
            {dateRange}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
