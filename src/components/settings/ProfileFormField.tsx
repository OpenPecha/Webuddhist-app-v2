import { useThemeColors } from '@/hooks/useThemeColors';
import { useUniwind } from 'uniwind';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

interface ProfileFormFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
  containerClassName?: string;
}

export function ProfileFormField({
  label,
  error,
  containerClassName,
  style,
  ...props
}: ProfileFormFieldProps) {
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const { foreground, mutedForeground, destructive } = useThemeColors();
  const borderColor = error ? destructive : isDark ? '#555555' : '#d4d4d4';
  const fillColor = isDark ? '#1a1a1a' : '#ffffff';

  return (
    <View className={containerClassName}>
      <View
        style={{
          borderRadius: 12,
          borderWidth: error ? 1.5 : 1,
          borderColor,
          backgroundColor: fillColor,
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 12, color: mutedForeground, marginBottom: 2 }}>{label}</Text>
        <TextInput
          placeholderTextColor={mutedForeground}
          style={[{ fontSize: 16, color: foreground, padding: 0 }, style]}
          {...props}
        />
      </View>
      {error ? (
        <Text className="text-destructive mt-1 text-sm">{error}</Text>
      ) : null}
    </View>
  );
}
