import { registerAppToastHandler } from '@/utils/show-app-toast';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TOAST_DURATION_MS = 2000;

export function AppToastHost() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    registerAppToastHandler((nextMessage) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);

      setMessage(nextMessage);
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      hideTimer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) setMessage(null);
        });
      }, TOAST_DURATION_MS);
    });

    return () => {
      registerAppToastHandler(null);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [opacity]);

  if (!message) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: insets.bottom + 24,
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <Animated.View
        style={{
          opacity,
          backgroundColor: 'rgba(0,0,0,0.85)',
          borderRadius: 24,
          paddingHorizontal: 20,
          paddingVertical: 12,
          maxWidth: '85%',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 14,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}
