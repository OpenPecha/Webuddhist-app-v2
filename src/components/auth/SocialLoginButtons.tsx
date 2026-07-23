import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { AUTH0_CUSTOM_SCHEME } from '@/providers/auth0';
import { useGuest } from '@/providers/guest';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';
import { useAuth0, WebAuthError, WebAuthErrorCodes } from 'react-native-auth0';
import { useState } from 'react';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { useUniwind } from 'uniwind';

interface SocialLoginButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  dark?: boolean;
  bordered?: boolean;
}

function SocialLoginButton({ icon, label, onPress, dark = false, bordered = false }: SocialLoginButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'h-[52px] w-full flex-row items-center justify-center gap-3 rounded-xl px-4 active:opacity-75',
        dark ? 'bg-black' : 'bg-background',
        bordered && 'border border-border',
      )}
    >
      {icon}
      <Text className={cn('text-base font-medium', dark ? 'text-white' : 'text-foreground')}>
        {label}
      </Text>
    </Pressable>
  );
}

interface SocialLoginButtonsProps {
  onSuccess?: () => void;
  className?: string;
}

export function SocialLoginButtons({ onSuccess, className }: SocialLoginButtonsProps) {
  const { authorize } = useAuth0();
  const { clearGuest } = useGuest();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const loginWith = async (connection: 'google-oauth2' | 'apple') => {
    setIsAuthorizing(true);
    try {
      await authorize(
        { scope: 'openid profile email offline_access', connection },
        { customScheme: AUTH0_CUSTOM_SCHEME },
      );
      await clearGuest();
      onSuccess?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const code = e instanceof WebAuthError ? e.code : (e as { code?: string })?.code;
      const type = e instanceof WebAuthError ? e.type : undefined;
      const isUserCancelled =
        type === WebAuthErrorCodes.USER_CANCELLED ||
        code === 'a0.session.user_cancelled' ||
        message.includes('user_cancelled');
      if (!isUserCancelled) {
        console.error(`${connection} login error:`, e);
      }
    } finally {
      setIsAuthorizing(false);
    }
  };

  if (isAuthorizing) {
    return (
      <View className={cn('h-[52px] items-center justify-center', className)}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className={cn('w-full gap-3.5', className)}>
      <SocialLoginButton
        icon={<GoogleIcon />}
        label={"Continue with Google"}
        onPress={() => loginWith('google-oauth2')}
        bordered={!isDark}
      />
      {Platform.OS === 'ios' ? (
        <SocialLoginButton
          icon={<Ionicons name="logo-apple" size={22} color="#fff" />}
          label={"Continue with Apple"}
          onPress={() => loginWith('apple')}
          dark
        />
      ) : null}
    </View>
  );
}
