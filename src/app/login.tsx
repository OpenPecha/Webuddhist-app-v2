import { AUTH0_CUSTOM_SCHEME } from '@/providers/auth0';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const bgImage = require('../../assets/images/bgimagereal4.png');

export default function Login() {
  const { authorize, isLoading } = useAuth0();
  const insets = useSafeAreaInsets();

  const loginWithGoogle = async () => {
    try {
      await authorize(
        { scope: 'openid profile email', connection: 'google-oauth2' },
        { customScheme: AUTH0_CUSTOM_SCHEME },
      );
    } catch (e) {
      console.error('Google login error:', e);
    }
  };

  const loginWithApple = async () => {
    try {
      await authorize(
        { scope: 'openid profile email', connection: 'apple' },
        { customScheme: AUTH0_CUSTOM_SCHEME },
      );
    } catch (e) {
      console.error('Apple login error:', e);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <Image
        source={bgImage}
        contentFit="cover"
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />

      <View className="absolute inset-0 bg-black/40" />

      <View
        className="flex-1 justify-between"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="items-center p-8">

          <Text className="text-3xl font-garamond font-bold text-white ">
            WeBuddhist
          </Text>
          <Text className="text-lg text-white/70 tracking-tight">
            Live ,Learn and Share Buddhism
          </Text>
        </View>

        <View className="px-6">
          <Pressable
            onPress={loginWithApple}
            className="mb-3 flex-row items-center justify-center rounded-full bg-white/20 py-4"
          >
            <Ionicons
              name="logo-apple"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-base font-semibold text-white">
              Continue with Apple
            </Text>
          </Pressable>

          <Pressable
            onPress={loginWithGoogle}
            className="mb-3 flex-row items-center justify-center rounded-full bg-white py-4"
          >
            <Ionicons
              name="logo-google"
              size={18}
              color="#000"
              style={{ marginRight: 8 }}
            />
            <Text className="text-base font-semibold text-black">
              Continue with Google
            </Text>
          </Pressable>

          <Text className="mt-1 text-center text-xs text-white/50">
            By using WeBuddhist you agree to our Terms
          </Text>
        </View>
      </View>
    </View>
  );
}
