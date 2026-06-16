import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

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
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        opacity: disabled && !isLoading ? 0.5 : pressed ? 0.85 : 1,
      })}
    >
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={{ width: 56, height: 56, borderRadius: 8 }} />
      ) : placeholderSource ? (
        <Image source={placeholderSource} style={{ width: 56, height: 56, borderRadius: 8 }} />
      ) : (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 8,
            backgroundColor: '#f0f0ec',
          }}
        />
      )}
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text
          style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold', color: '#000' }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ fontSize: 14, color: '#8a8a8a', marginTop: 2 }} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {isLoading ? <ActivityIndicator size="small" style={{ marginLeft: 12 }} /> : null}
    </Pressable>
  );
}
