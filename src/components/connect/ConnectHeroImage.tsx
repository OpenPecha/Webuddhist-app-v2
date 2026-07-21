import { CONNECT_HERO } from '@/components/connect/connect-styles';
import { APP_ASSETS } from '@/constants/app-assets';
import { Image } from 'expo-image';
import { View } from 'react-native';

/** Hero shown when user has no my-groups (Connect S2). Mirrors Flutter `AppAssets.connect`. */
export function ConnectHeroImage() {
  return (
    <View className="mx-5 mb-2 mt-5 overflow-hidden rounded-[20px]">
      <Image
        source={APP_ASSETS.connect}
        style={{ width: '100%', aspectRatio: CONNECT_HERO.aspectRatio }}
        contentFit="cover"
      />
    </View>
  );
}
