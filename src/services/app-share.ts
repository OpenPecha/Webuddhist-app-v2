import { Share } from 'react-native';

const IOS_APP_STORE_URL = 'https://apps.apple.com/app/webuddhist/id6745810914';
const ANDROID_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=org.pecha.app';

export function generateAppShareMessage(): string {
  return `I'm using WeBuddhist to learn and practice Buddhism. Join me!

📲 Download:
iOS: ${IOS_APP_STORE_URL}
Android: ${ANDROID_PLAY_STORE_URL}`;
}

export async function shareApp(): Promise<void> {
  await Share.share({
    message: generateAppShareMessage(),
    title: 'Join me on WeBuddhist',
  });
}
