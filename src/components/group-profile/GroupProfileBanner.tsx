import { GP_BANNER_ASPECT, GP_BANNER_RADIUS, GP_PADDING } from '@/components/group-profile/group-profile-styles';
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
    <View
      style={{
        marginHorizontal: GP_PADDING,
        marginTop: 8,
        borderRadius: GP_BANNER_RADIUS,
        overflow: 'hidden',
      }}
    >
      <Image
        source={{ uri: bannerUrl }}
        style={{ width: '100%', aspectRatio: GP_BANNER_ASPECT, backgroundColor: skeleton }}
        contentFit="cover"
      />
    </View>
  );
}
