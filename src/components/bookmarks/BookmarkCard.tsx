import {
  bookmarkDisplayTitle,
  bookmarkIsText,
  type BookmarkDTO,
  type BookmarkItemType,
} from '@/types/bookmarks';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

function typeLabel(type: BookmarkItemType): string {
  switch (type) {
    case 'PLAN':
      return "Plan";
    case 'SERIES':
      return "Series";
    case 'ACCUMULATOR':
      return "Mala";
    case 'TIMER':
      return "Timer";
    case 'TEXT':
      return "Text";
    case 'VERSE':
      return "Verse";
    default:
      return type;
  }
}

function formatDateRange(bookmark: BookmarkDTO): string | null {
  if (!bookmark.startDate) return null;
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (bookmark.endDate) return `${fmt(bookmark.startDate)} - ${fmt(bookmark.endDate)}`;
  return fmt(bookmark.startDate);
}

interface BookmarkCardProps {
  bookmark: BookmarkDTO;
  onPress?: () => void;
  onRemove: () => void;
}

export function BookmarkCard({ bookmark, onPress, onRemove }: BookmarkCardProps) {
  const title = bookmarkDisplayTitle(bookmark);
  const dateLabel = formatDateRange(bookmark);
  const badge = typeLabel(bookmark.type);

  if (bookmarkIsText(bookmark)) {
    const excerpt = (bookmark.excerpt ?? '').replace(/<[^>]+>/g, '').trim();
    return (
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        className="mb-3 rounded-xl border border-[#e8e8e4] bg-white overflow-hidden"
      >
        <View className="flex-row">
          <View className="w-1 bg-[#c4a574]" />
          <View className="flex-1 p-3">
            <View className="flex-row items-start">
              <View className="flex-1 mr-2">
                <Text className="text-[15px] font-bold text-foreground" numberOfLines={2}>
                  {title}
                </Text>
                {excerpt ? (
                  <Text className="text-[13px] text-muted-foreground mt-1" numberOfLines={2}>
                    {excerpt}
                  </Text>
                ) : null}
                <Text className="text-[11px] text-muted-foreground mt-1.5">{badge}</Text>
              </View>
              <Pressable onPress={onRemove} className="p-1">
                <Ionicons name="bookmark" size={20} color="#000" />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center mb-3 p-3 rounded-xl border border-[#e8e8e4] bg-white"
    >
      <View
        className={cn(
          'w-12 h-12 overflow-hidden bg-[#f0f0ec]',
          bookmark.type === 'ACCUMULATOR' ? 'rounded-full' : 'rounded-lg',
        )}
      >
        {bookmark.imageUrl ? (
          <Image source={{ uri: bookmark.imageUrl }} style={{ width: 48, height: 48 }} contentFit="cover" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="bookmark-outline" size={20} color="#666" />
          </View>
        )}
      </View>
      <View className="flex-1 ml-3 mr-2">
        <Text className="text-[15px] font-bold text-foreground" numberOfLines={2}>
          {title}
        </Text>
        {dateLabel ? (
          <Text className="text-[13px] text-muted-foreground mt-1">{dateLabel}</Text>
        ) : null}
        <Text className="text-[11px] text-muted-foreground mt-1">{badge}</Text>
      </View>
      <Pressable onPress={onRemove} className="p-1">
        <Ionicons name="bookmark" size={20} color="#000" />
      </Pressable>
    </Pressable>
  );
}
