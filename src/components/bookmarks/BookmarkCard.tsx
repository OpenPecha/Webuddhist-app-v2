import {
  bookmarkDisplayTitle,
  bookmarkIsText,
  type BookmarkDTO,
  type BookmarkItemType,
} from '@/types/bookmarks';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

function typeLabel(type: BookmarkItemType, t: (k: string) => string): string {
  switch (type) {
    case 'PLAN':
      return t('bookmarks.type_plan');
    case 'SERIES':
      return t('bookmarks.type_series');
    case 'ACCUMULATOR':
      return t('bookmarks.type_mala');
    case 'TIMER':
      return t('bookmarks.type_timer');
    case 'TEXT':
      return t('bookmarks.type_text');
    case 'VERSE':
      return t('bookmarks.type_verse');
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
  const { t } = useTranslation();
  const title = bookmarkDisplayTitle(bookmark);
  const dateLabel = formatDateRange(bookmark);
  const badge = typeLabel(bookmark.type, t);

  if (bookmarkIsText(bookmark)) {
    const excerpt = (bookmark.excerpt ?? '').replace(/<[^>]+>/g, '').trim();
    return (
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={{
          marginBottom: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#e8e8e4',
          backgroundColor: '#fff',
          overflow: 'hidden',
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 4, backgroundColor: '#c4a574' }} />
          <View style={{ flex: 1, padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#000' }} numberOfLines={2}>
                  {title}
                </Text>
                {excerpt ? (
                  <Text style={{ fontSize: 13, color: '#666', marginTop: 4 }} numberOfLines={2}>
                    {excerpt}
                  </Text>
                ) : null}
                <Text style={{ fontSize: 11, color: '#8a8a8a', marginTop: 6 }}>{badge}</Text>
              </View>
              <Pressable onPress={onRemove} style={{ padding: 4 }}>
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
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e8e8e4',
        backgroundColor: '#fff',
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: bookmark.type === 'ACCUMULATOR' ? 24 : 8,
          overflow: 'hidden',
          backgroundColor: '#f0f0ec',
        }}
      >
        {bookmark.imageUrl ? (
          <Image source={{ uri: bookmark.imageUrl }} style={{ width: 48, height: 48 }} contentFit="cover" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="bookmark-outline" size={20} color="#666" />
          </View>
        )}
      </View>
      <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#000' }} numberOfLines={2}>
          {title}
        </Text>
        {dateLabel ? (
          <Text style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{dateLabel}</Text>
        ) : null}
        <Text style={{ fontSize: 11, color: '#8a8a8a', marginTop: 4 }}>{badge}</Text>
      </View>
      <Pressable onPress={onRemove} style={{ padding: 4 }}>
        <Ionicons name="bookmark" size={20} color="#000" />
      </Pressable>
    </Pressable>
  );
}
