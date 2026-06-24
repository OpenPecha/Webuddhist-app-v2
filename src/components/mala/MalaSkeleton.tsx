import { useThemeColors } from '@/hooks/useThemeColors';
import { ActivityIndicator, View } from 'react-native';

export function MalaSkeleton() {
  const { mutedForeground } = useThemeColors();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <ActivityIndicator size="large" color={mutedForeground} />
    </View>
  );
}
