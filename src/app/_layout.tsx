import { ensureI18nReady } from '@/lib/i18n';
import { configureNotificationHandler } from '@/lib/notifications';
import { AuthTokenSync } from '@/providers/auth-token';
import { Auth0ProviderWrapper } from '@/providers/auth0';
import { GuestProvider, useGuest } from '@/providers/guest';
import { OnboardingProvider, useOnboarding } from '@/providers/onboarding';
import { QueryProvider } from '@/providers/query';
import { ThemeProvider } from '@/providers/theme';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth0 } from 'react-native-auth0';
import '../../global.css';

SplashScreen.preventAutoHideAsync();
configureNotificationHandler();

function AuthGate() {
  const { user, isLoading: authLoading } = useAuth0();
  const { isGuest, isResolved: guestResolved } = useGuest();
  const { isCompleted: onboardingDone, isResolved: onboardingResolved } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();

  const isLoading = authLoading || !guestResolved || !onboardingResolved;
  const isAuthenticated = !!user || isGuest;

  useEffect(() => {
    if (isLoading) return;

    const onLogin = segments[0] === 'login';
    const onOnboarding = segments[0] === 'onboarding';

    if (!isAuthenticated) {
      if (!onLogin) router.replace('/login');
      return;
    }

    // Guests skip onboarding
    if (isGuest) {
      if (onLogin || onOnboarding) router.replace('/');
      return;
    }

    // Authenticated user: show onboarding once
    if (!onboardingDone) {
      if (!onOnboarding) router.replace('/onboarding');
      return;
    }

    // Onboarding done — keep off login/onboarding
    if (onLogin || onOnboarding) router.replace('/');
  }, [isAuthenticated, isGuest, isLoading, onboardingDone]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FDFDFC' } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="series/[id]" />
      <Stack.Screen name="practice" />
      <Stack.Screen name="reader/[textId]" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'EBGaramond-Regular': require('../../assets/fonts/EBGaramond-Regular.ttf'),
    'Inter-Regular': require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
    'Inter-SemiBold': require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
    'Inter-Bold': require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
  });
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    ensureI18nReady().then(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && i18nReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, i18nReady]);

  if ((!fontsLoaded && !fontError) || !i18nReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <Auth0ProviderWrapper>
          <GuestProvider>
            <AuthTokenSync>
              <OnboardingProvider>
                <ThemeProvider>
                  <AuthGate />
                </ThemeProvider>
              </OnboardingProvider>
            </AuthTokenSync>
          </GuestProvider>
        </Auth0ProviderWrapper>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
