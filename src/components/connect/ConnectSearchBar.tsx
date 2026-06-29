import { Ionicons } from '@expo/vector-icons';
import { MagnifyingGlass } from 'phosphor-react-native';
import { Pressable, TextInput, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ConnectSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onBack: () => void;
  autoFocus?: boolean;
}

export function ConnectSearchBar({
  value,
  onChangeText,
  placeholder,
  onBack,
  autoFocus = true,
}: ConnectSearchBarProps) {
  const { foreground, mutedForeground, cardSurface, cardBorder } = useThemeColors();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8 }}>
      <Pressable onPress={onBack} style={{ padding: 8 }}>
        <Ionicons name="chevron-back" size={24} color={foreground} />
      </Pressable>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 12,
          paddingHorizontal: 12,
          backgroundColor: cardSurface,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: cardBorder,
        }}
      >
        <MagnifyingGlass size={20} color={mutedForeground} style={{ marginRight: 8 }} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={mutedForeground}
          autoFocus={autoFocus}
          style={{
            flex: 1,
            fontSize: 15,
            color: foreground,
            paddingVertical: 12,
          }}
        />
        {value.length > 0 ? (
          <Pressable onPress={() => onChangeText('')} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color={mutedForeground} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
