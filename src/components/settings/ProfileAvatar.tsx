import { avatarCacheKey } from '@/lib/username-validation';
import { User } from '@/constants/settings-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface ProfileAvatarProps {
  url?: string | null;
  size?: number;
  loading?: boolean;
}

export function ProfileAvatar({ url, size = 104, loading = false }: ProfileAvatarProps) {
  const radius = size / 2;
  const { mutedForeground } = useThemeColors();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [url]);

  if (loading) {
    return (
      <View
        className="items-center justify-center"
        style={{ width: size, height: size, borderRadius: radius, backgroundColor: '#d4d4d4' }}
      >
        <ActivityIndicator color={mutedForeground} />
      </View>
    );
  }

  if (url && !imageError) {
    return (
      <Image
        source={{ uri: url }}
        recyclingKey={avatarCacheKey(url)}
        style={{ width: size, height: size, borderRadius: radius }}
        contentFit="cover"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: '#d4d4d4' }}
    >
      <User size={size * 0.42} color={mutedForeground} />
    </View>
  );
}
