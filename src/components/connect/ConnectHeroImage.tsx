import { CONNECT_HERO, CONNECT_PADDING } from '@/components/connect/connect-styles';
import { APP_ASSETS } from '@/constants/app-assets';
import { Image } from 'expo-image';
import { View } from 'react-native';

/** Hero shown when user has no my-groups (Connect S2). Mirrors Flutter `AppAssets.connect`. */
export function ConnectHeroImage() {
  return (
    <View
      style={{
        marginHorizontal: CONNECT_PADDING,
        marginTop: 20,
        marginBottom: 8,
        borderRadius: CONNECT_HERO.borderRadius,
        overflow: 'hidden',
      }}
    >
      <Image
        source={APP_ASSETS.connect}
        style={{ width: '100%', aspectRatio: CONNECT_HERO.aspectRatio }}
        contentFit="cover"
      />
    </View>
  );
}
