import { cn } from '@/utils/cn';
import { useThemeColors } from '@/hooks/useThemeColors';
import { CaretRight, ArrowSquareOut } from '@/constants/settings-icons';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';
import type { IconProps } from 'phosphor-react-native';

type IconComponent = React.ComponentType<IconProps>;

interface SettingsRowProps {
  icon: IconComponent;
  title: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  trailingIcon?: 'caret' | 'external';
  destructive?: boolean;
  disabled?: boolean;
}

export function SettingsRow({
  icon: Icon,
  title,
  onPress,
  trailing,
  trailingIcon = 'caret',
  destructive = false,
  disabled = false,
}: SettingsRowProps) {
  const { foreground, mutedForeground, destructive: destructiveColor } = useThemeColors();
  const iconColor = destructive ? destructiveColor : foreground;
  const TrailingIcon = trailingIcon === 'external' ? ArrowSquareOut : CaretRight;

  const content = (
    <View className="flex-row items-center py-3">
      <Icon size={24} color={iconColor} />
      <Text
        className={cn('ml-3 flex-1 text-base', destructive ? 'text-destructive' : 'text-foreground')}
      >
        {title}
      </Text>
      {trailing ?? <TrailingIcon size={22} color={destructive ? destructiveColor : mutedForeground} />}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} disabled={disabled} className="active:opacity-70">
      {content}
    </Pressable>
  );
}
