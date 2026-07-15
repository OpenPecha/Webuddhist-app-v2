import { APP_ASSETS } from '@/constants/app-assets';
import type { RoutineItemType } from '@/types/routine';
import { imageUrl } from '@/utils/image-url';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface RoutineItemCardProps {
  title: string;
  coverUri?: string;
  type?: RoutineItemType;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  onDelete?: () => void;
  onReorderDragStart?: () => void;
  isDragging?: boolean;
}

/** Matches Flutter RoutineItemCard layout (74×74 cover, title, optional subtitle row). */
export function RoutineItemCard({
  title,
  coverUri,
  type,
  subtitle,
  trailing,
  onPress,
  onDelete,
  onReorderDragStart,
  isDragging,
}: RoutineItemCardProps) {
  const showSubtitleRow = subtitle != null;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        opacity: pressed && onPress ? 0.85 : 1,
        borderRadius: 10,
        backgroundColor: isDragging ? '#FDFDFC' : 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: isDragging ? 2 : 0 },
        shadowOpacity: isDragging ? 0.12 : 0,
        shadowRadius: isDragging ? 4 : 0,
        elevation: isDragging ? 2 : 0,
      })}
    >
      {onDelete ? (
        <>
          <Pressable
            onPress={onDelete}
            hitSlop={8}
            style={{
              width: 24,
              height: 24,
              marginLeft: 8,
              borderRadius: 12,
              backgroundColor: '#f0f0ec',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="remove" size={16} color="#000" />
          </Pressable>
          <View style={{ width: 20 }} />
        </>
      ) : null}

      {type === 'recitation' ? (
        <Image
          source={APP_ASSETS.recitationCoverDefault}
          style={{ width: 74, height: 74, borderRadius: 10 }}
          contentFit="cover"
        />
      ) : type === 'series' && !coverUri ? (
        <Image
          source={APP_ASSETS.seriesCoverFallback}
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

      {onReorderDragStart ? (
        <Pressable
          onLongPress={onReorderDragStart}
          delayLongPress={120}
          hitSlop={8}
          style={{ marginLeft: 8, padding: 4 }}
        >
          <Ionicons name="reorder-three" size={22} color="#8a8a8a" />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

export function routineItemCoverUri(coverImage: Parameters<typeof imageUrl>[0], legacyUrl?: string | null) {
  return imageUrl(coverImage, 'medium') || legacyUrl || '';
}
