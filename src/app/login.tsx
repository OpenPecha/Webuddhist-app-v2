import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { AUTH0_CUSTOM_SCHEME } from '@/providers/auth0';
import { useGuest } from '@/providers/guest';
import { cn } from '@/utils/cn';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../assets/images/webuddhist_gold.png');

interface LoginButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  dark?: boolean;
  bordered?: boolean;
}

function LoginButton({ icon, label, onPress, dark = false, bordered = false }: LoginButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'mb-4 w-[70%] flex-row items-center gap-3 rounded-lg px-4 py-3.5 active:opacity-75',
        dark ? 'bg-black' : 'bg-white',
        bordered && 'border border-[#aaa]',
      )}
    >
      {icon}
      <Text className={`text-base ${dark ? 'text-white' : 'text-foreground'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function Login() {
  const { authorize, isLoading } = useAuth0();
  const { continueAsGuest } = useGuest();
  const insets = useSafeAreaInsets();

  const loginWithGoogle = async () => {
    try {
      await authorize(
        { scope: 'openid profile email offline_access', connection: 'google-oauth2' },
        { customScheme: AUTH0_CUSTOM_SCHEME },
      );
    } catch (e) {
      console.error('Google login error:', e);
    }
  };

  const loginWithApple = async () => {
    try {
      await authorize(
        { scope: 'openid profile email offline_access', connection: 'apple' },
        { customScheme: AUTH0_CUSTOM_SCHEME },
      );
    } catch (e) {
      console.error('Apple login error:', e);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View
        className="absolute left-0 right-0 items-center gap-2"
        style={{ top: (insets.top || 44) + 40 }}
      >
        <Image source={logo} style={{ width: 150, height: 150 }} contentFit="contain" />
        <Text className="text-[32px] font-bold">
          {"WeBuddhist"}
        </Text>
      </View>

      <View
        className="flex-1 items-center justify-end"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 48,
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <>
            <LoginButton
              icon={<GoogleIcon />}
              label={"Continue with Google"}
              onPress={loginWithGoogle}
              bordered
            />

            {Platform.OS === 'ios' && (
              <LoginButton
                icon={<Ionicons name="logo-apple" size={22} color="#fff" />}
                label={"Continue with Apple"}
                onPress={loginWithApple}
                dark
              />
            )}

            <LoginButton
              icon={<Ionicons name="person-outline" size={20} color="#000" />}
              label={"Continue as guest"}
              onPress={continueAsGuest}
              bordered
            />
          </>
        )}
      </View>
    </View>
  );
}
