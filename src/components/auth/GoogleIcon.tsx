import { Image } from 'expo-image';

const googleIcon = require('../../../assets/images/google-icon.png');

/** Multicolor Google "G" — matches Flutter `assets/images/google-icon.png`. */
export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Image
      source={googleIcon}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}
