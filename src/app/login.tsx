import '@/lib/i18n';
import { AUTH0_CUSTOM_SCHEME } from '@/providers/auth0';
import { useGuest } from '@/providers/guest';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, Pressable, Text, View } from 'react-native';
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
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: dark ? '#000' : '#fff',
        borderWidth: bordered ? 0.5 : 0,
        borderColor: '#aaa',
        gap: 12,
        opacity: pressed ? 0.75 : 1,
        marginBottom: 16,
      })}
    >
      {icon}
      <Text style={{ fontSize: 16, color: dark ? '#fff' : '#000', fontFamily: 'Inter-Regular' }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function Login() {
  const { authorize, isLoading } = useAuth0();
  const { continueAsGuest } = useGuest();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

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

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style="dark" />

      {/* Logo + title — positioned at 20% from top, matching Flutter */}
      <View style={{
        position: 'absolute',
        top: (insets.top || 44) + 40,
        left: 0, right: 0,
        alignItems: 'center', gap: 8,
      }}>
        <Image source={logo} style={{ width: 150, height: 150 }} contentFit="contain" />
        <Text style={{ fontSize: 32, fontWeight: 'bold', fontFamily: 'Inter-Bold' }}>
          {t('appTitle')}
        </Text>
      </View>

      {/* Auth buttons — centered lower half */}
      <View style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 48,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <>
            <LoginButton
              icon={<Ionicons name="logo-google" size={20} color="#000" />}
              label={t('auth.continue_with_google')}
              onPress={loginWithGoogle}
              bordered
            />

            {Platform.OS === 'ios' && (
              <LoginButton
                icon={<Ionicons name="logo-apple" size={22} color="#fff" />}
                label={t('auth.continue_with_apple')}
                onPress={loginWithApple}
                dark
              />
            )}

            <LoginButton
              icon={<Ionicons name="person-outline" size={20} color="#000" />}
              label={t('auth.continue_as_guest')}
              onPress={continueAsGuest}
              bordered
            />
          </>
        )}
      </View>
    </View>
  );
}
