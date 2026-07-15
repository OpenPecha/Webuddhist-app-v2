import { useFloatingInputChrome } from '@/components/ui/floating-text-input/use-floating-input-chrome';
import type { FloatingTextInputProps } from '@/components/ui/floating-text-input/types';
import { useEffect, useState } from 'react';
import {
  Animated,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

const ANIM_DURATION = 180;
const HORIZONTAL_PADDING = 16;
const CORNER_RADIUS = 12;

export function FloatingTextInput({
  label,
  value = '',
  onChangeText,
  error,
  containerClassName,
  multiline = false,
  minHeight,
  hint,
  trailingIcon,
  maxLength,
  autoCapitalize,
  autoCorrect = true,
  editable = true,
  onFocus,
  onBlur,
  style,
  ...props
}: FloatingTextInputProps & Omit<TextInputProps, keyof FloatingTextInputProps>) {
  const [focused, setFocused] = useState(false);
  const hasValue = String(value ?? '').length > 0;
  const floated = focused || hasValue;
  const isError = !!error;

  const { background, foreground, mutedForeground, destructive, borderColor, borderWidth } =
    useFloatingInputChrome(focused, isError);

  const [progress] = useState(
    () => new Animated.Value(String(value ?? '').length > 0 ? 1 : 0),
  );

  useEffect(() => {
    Animated.timing(progress, {
      toValue: floated ? 1 : 0,
      duration: ANIM_DURATION,
      useNativeDriver: false,
    }).start();
  }, [floated, progress]);

  const labelTop = progress.interpolate({
    inputRange: [0, 1],
    outputRange: multiline ? [22, -8] : [18, -8],
  });

  const labelFontSize = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const containerMinHeight = multiline ? (minHeight ?? 96) : 56;

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur: TextInputProps['onBlur'] = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <View className={containerClassName}>
      <View
        style={{
          borderRadius: CORNER_RADIUS,
          borderWidth,
          borderColor,
          backgroundColor: 'transparent',
          minHeight: containerMinHeight,
          position: 'relative',
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: HORIZONTAL_PADDING - 4,
            top: labelTop,
            zIndex: 2,
            paddingHorizontal: 4,
            paddingVertical: 1,
            backgroundColor: background,
            alignSelf: 'flex-start',
            maxWidth: '90%',
          }}
        >
          <Animated.Text
            numberOfLines={1}
            style={{
              fontSize: labelFontSize,
              color: isError ? destructive : mutedForeground,
            }}
          >
            {label}
          </Animated.Text>
        </Animated.View>

        <Animated.View style={{ flex: 1 }}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            maxLength={maxLength}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            editable={editable}
            textAlignVertical={multiline ? 'top' : 'center'}
            placeholder={hint && floated && !hasValue ? hint : undefined}
            placeholderTextColor={mutedForeground}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              {
                fontSize: 16,
                color: foreground,
                paddingHorizontal: HORIZONTAL_PADDING,
                paddingRight: HORIZONTAL_PADDING + (trailingIcon ? 28 : 0),
                paddingBottom: multiline ? 14 : 0,
                minHeight: multiline ? (minHeight ?? 96) - 22 : 34,
              },
              style,
            ]}
            {...props}
          />
        </Animated.View>

        {trailingIcon ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              right: HORIZONTAL_PADDING,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
            }}
          >
            {trailingIcon}
          </View>
        ) : null}
      </View>
      {error ? (
        <Text className="text-destructive mt-1 text-sm">{error}</Text>
      ) : null}
    </View>
  );
}
