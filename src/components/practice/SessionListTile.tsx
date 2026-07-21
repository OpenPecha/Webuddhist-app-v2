import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, View } from 'react-native';

interface SessionListTileProps {
  title: string;
  subtitle?: string | null;
  coverUri?: string;
  placeholderSource?: number;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

/** Matches Flutter _SessionListTile (56×56 cover, title, optional subtitle). */
export function SessionListTile({
  title,
  subtitle,
  coverUri,
  placeholderSource,
  onPress,
  isLoading = false,
  disabled = false,
}: SessionListTileProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn(
        'flex-row items-center py-3',
        disabled && !isLoading && 'opacity-50',
        !disabled && 'active:opacity-85',
      )}
    >
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={{ width: 56, height: 56, borderRadius: 8 }} />
      ) : placeholderSource ? (
        <Image source={placeholderSource} style={{ width: 56, height: 56, borderRadius: 8 }} />
      ) : (
        <View className="w-14 h-14 rounded-lg bg-[#f0f0ec]" />
      )}
      <View className="flex-1 ml-4">
        <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-sm text-muted-foreground mt-0.5" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {isLoading ? <ActivityIndicator size="small" style={{ marginLeft: 12 }} /> : null}
    </Pressable>
  );
}
