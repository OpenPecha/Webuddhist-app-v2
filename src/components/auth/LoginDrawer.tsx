import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { useGuest } from '@/providers/guest';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

const logo = require('../../../assets/images/webuddhist_gold.png');

interface LoginDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function LoginDrawer({ visible, onClose }: LoginDrawerProps) {
  const { user } = useAuth0();
  const { clearGuest } = useGuest();

  useEffect(() => {
    if (visible && user) {
      clearGuest().finally(onClose);
    }
  }, [visible, user, clearGuest, onClose]);

  return (
    <AppBottomSheet visible={visible} onClose={onClose} placement="tab">
      <View className="items-center gap-6 px-6 pb-6">
        <Image source={logo} style={{ width: 80, height: 80 }} contentFit="contain" />

        <View className="items-center gap-1">
          <Text className="text-center text-xl font-bold">{"Log in to continue"}</Text>
          <Text className="text-center text-[15px] leading-[22px] text-muted-foreground">
            {"Continue your practice on any device, wherever you go."}
          </Text>
        </View>

        <SocialLoginButtons onSuccess={onClose} className="px-0" />
      </View>
    </AppBottomSheet>
  );
}
