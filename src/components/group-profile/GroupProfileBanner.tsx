import { GP_BANNER_ASPECT } from '@/components/group-profile/group-profile-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Image } from 'expo-image';
import { View } from 'react-native';

interface GroupProfileBannerProps {
  bannerUrl?: string | null;
}

export function GroupProfileBanner({ bannerUrl }: GroupProfileBannerProps) {
  const { skeleton } = useThemeColors();

  if (!bannerUrl) return null;

  return (
    <View className="mx-4 mt-2 overflow-hidden rounded-2xl">
      <Image
        source={{ uri: bannerUrl }}
        style={{ width: '100%', aspectRatio: GP_BANNER_ASPECT, backgroundColor: skeleton }}
        contentFit="cover"
      />
    </View>
  );
}
