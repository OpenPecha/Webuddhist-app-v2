import { AppToggleSwitch } from '@/components/settings/AppToggleSwitch';
import { Info } from '@/constants/settings-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Pressable, Text, View } from 'react-native';

interface NotificationSwitchTileProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  titleSize?: number;
  subtitleSize?: number;
  onInfo?: () => void;
}

export function NotificationSwitchTile({
  title,
  subtitle,
  value,
  onValueChange,
  titleSize = 16,
  subtitleSize = 13.5,
  onInfo,
}: NotificationSwitchTileProps) {
  const { mutedForeground } = useThemeColors();

  return (
    <View className="flex-row items-start py-4">
      <View className="flex-1 pr-4">
        <View className="flex-row items-start">
          <Text className="flex-1 font-semibold" style={{ fontSize: titleSize }}>
            {title}
          </Text>
          {onInfo ? (
            <Pressable onPress={onInfo} className="ml-1 p-1 active:opacity-70">
              <Info size={17} color={mutedForeground} />
            </Pressable>
          ) : null}
        </View>
        <Text
          className="text-muted-foreground mt-1"
          style={{ fontSize: subtitleSize, lineHeight: subtitleSize * 1.4, opacity: 0.85 }}
        >
          {subtitle}
        </Text>
      </View>
      <AppToggleSwitch value={value} onValueChange={onValueChange} />
    </View>
  );
}
