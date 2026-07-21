import { Text } from '@/components/ui/text';
import { registerAppToastHandler } from '@/utils/show-app-toast';
import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
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
      className="absolute inset-x-0 z-9999 items-center"
      style={{ bottom: insets.bottom + 24 }}
    >
      <Animated.View
        className="max-w-[85%] rounded-3xl bg-black/85 px-5 py-3"
        style={{ opacity }}
      >
        <Text className="text-center text-sm font-semibold text-white">{message}</Text>
      </Animated.View>
    </View>
  );
}
