import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { APP_ASSETS } from '@/constants/app-assets';
import type { RoutineItemType } from '@/types/routine';
import { imageUrl } from '@/utils/image-url';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

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
      className={cn(
        'flex-row items-center py-3 rounded-[10px]',
        onPress && 'active:opacity-85',
        isDragging ? 'bg-[#FDFDFC]' : 'bg-transparent',
      )}
      style={
        isDragging
          ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 2,
            }
          : undefined
      }
    >
      {onDelete ? (
        <>
          <Pressable
            onPress={onDelete}
            hitSlop={8}
            className="w-6 h-6 ml-2 rounded-full bg-[#f0f0ec] items-center justify-center"
          >
            <Ionicons name="remove" size={16} color="#000" />
          </Pressable>
          <View className="w-5" />
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
        <View className="w-[74px] h-[74px] rounded-[10px] bg-[#f0f0ec]" />
      )}

      <View className="flex-1 ml-4 justify-center">
        <Text className="text-base font-semibold text-foreground" numberOfLines={2}>
          {title}
        </Text>

        {showSubtitleRow ? (
          <View className="mt-2 flex-row items-center gap-2">
            <View className="flex-1">{subtitle}</View>
            {trailing}
          </View>
        ) : null}
      </View>

      {onReorderDragStart ? (
        <Pressable
          onLongPress={onReorderDragStart}
          delayLongPress={120}
          hitSlop={8}
          className="ml-2 p-1"
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
