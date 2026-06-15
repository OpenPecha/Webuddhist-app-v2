import type { RoutineItemType } from '@/types/routine';
import { imageUrl } from '@/utils/image-url';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

const recitationPlaceholder = require('../../../assets/images/bgimage2.jpg');

interface RoutineItemCardProps {
  title: string;
  coverUri?: string;
  type?: RoutineItemType;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
}

/** Matches Flutter RoutineItemCard layout (74×74 cover, title, optional subtitle row). */
export function RoutineItemCard({
  title,
  coverUri,
  type,
  subtitle,
  trailing,
  onPress,
}: RoutineItemCardProps) {
  const showSubtitleRow = subtitle != null;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        paddingVertical: 12,
        opacity: pressed && onPress ? 0.85 : 1,
      })}
    >
      {type === 'recitation' ? (
        <Image
          source={recitationPlaceholder}
          style={{ width: 74, height: 74, borderRadius: 10 }}
          contentFit="cover"
        />
      ) : coverUri ? (
        <Image
          source={{ uri: coverUri }}
          style={{ width: 74, height: 74, borderRadius: 10 }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={{
            width: 74,
            height: 74,
            borderRadius: 10,
            backgroundColor: '#f0f0ec',
          }}
        />
      )}

      <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: '#000',
          }}
          numberOfLines={2}
        >
          {title}
        </Text>

        {showSubtitleRow ? (
          <View
            style={{
              marginTop: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <View style={{ flex: 1 }}>{subtitle}</View>
            {trailing}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export function routineItemCoverUri(coverImage: Parameters<typeof imageUrl>[0], legacyUrl?: string | null) {
  return imageUrl(coverImage, 'medium') || legacyUrl || '';
}
