import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

const TRACK_ON = '#196BF1';
const TRACK_OFF = '#ADADAD';
const THUMB_GREY = '#797979';

interface AppToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  thumbOnColor?: string;
  thumbOffColor?: string;
}

/** Matches Flutter `AppToggleSwitch` — 64×32 pill toggle. */
export function AppToggleSwitch({
  value,
  onValueChange,
  thumbOnColor = THUMB_GREY,
  thumbOffColor = '#ffffff',
}: AppToggleSwitchProps) {
  const align = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(align, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [align, value]);

  const thumbLeft = align.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 34],
  });

  return (
    <Pressable onPress={() => onValueChange(!value)} accessibilityRole="switch">
      <Animated.View
        style={{
          width: 64,
          height: 32,
          borderRadius: 16,
          backgroundColor: value ? TRACK_ON : TRACK_OFF,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            left: thumbLeft,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: value ? thumbOnColor : thumbOffColor,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
