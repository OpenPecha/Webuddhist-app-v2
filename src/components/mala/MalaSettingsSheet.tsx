import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { AppToggleSwitch } from '@/components/settings/AppToggleSwitch';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { MalaPreferences } from '@/lib/mala-preferences';
import {
  ArrowsClockwise,
  BookmarkSimple,
  Plus,
  SpeakerHigh,
  Vibrate,
} from 'phosphor-react-native';
import type { IconProps } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MalaSettingsSheetProps {
  visible: boolean;
  prefs: MalaPreferences;
  onClose: () => void;
  onAddToPracticePress?: () => void;
  onBookmarkPress?: () => void;
  onResetPress: () => void;
  onSoundChange: (value: boolean) => void;
  onVibrationChange: (value: boolean) => void;
}

function SheetDivider({ color }: { color: string }) {
  return <View className="h-px" style={{ backgroundColor: color }} />;
}

function SettingsActionRow({
  icon: Icon,
  label,
  onPress,
  destructive = false,
}: {
  icon: React.ComponentType<IconProps>;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const { foreground, destructive: destructiveColor } = useThemeColors();
  const color = destructive ? destructiveColor : foreground;

  const row = (
    <View className="flex-row items-center py-4">
      <Icon size={24} color={color} />
      <Text
        className={cn('ml-3 flex-1 text-base', destructive ? 'text-destructive' : 'text-foreground')}
      >
        {label}
      </Text>
    </View>
  );

  if (!onPress) return row;

  return (
    <Pressable onPress={onPress} className="active:opacity-70">
      {row}
    </Pressable>
  );
}

function SettingsToggleRow({
  icon: Icon,
  label,
  value,
  onValueChange,
}: {
  icon: React.ComponentType<IconProps>;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { foreground } = useThemeColors();

  return (
    <View className="flex-row items-center py-4">
      <Icon size={24} color={foreground} />
      <Text className="ml-3 flex-1 text-base text-foreground">{label}</Text>
      <AppToggleSwitch value={value} onValueChange={onValueChange} />
    </View>
  );
}

export function MalaSettingsSheet({
  visible,
  prefs,
  onClose,
  onAddToPracticePress,
  onBookmarkPress,
  onResetPress,
  onSoundChange,
  onVibrationChange,
}: MalaSettingsSheetProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { borderInput } = useThemeColors();

  const handleReset = () => {
    onClose();
    onResetPress();
  };

  const handleAddToPractice = () => {
    onClose();
    onAddToPracticePress?.();
  };

  const handleBookmark = () => {
    onClose();
    onBookmarkPress?.();
  };

  return (
    <AppBottomSheet visible={visible} onClose={onClose} placement="fullscreen" showHandle>
      <View className="px-5" style={{ paddingBottom: Math.max(16, insets.bottom) }}>
        <SettingsActionRow
          icon={Plus}
          label={t('mala.settings_add_to_practice')}
          onPress={handleAddToPractice}
        />
        <SheetDivider color={borderInput} />

        <SettingsActionRow
          icon={BookmarkSimple}
          label={t('mala.settings_bookmark')}
          onPress={handleBookmark}
        />
        <SheetDivider color={borderInput} />

        <SettingsToggleRow
          icon={SpeakerHigh}
          label={t('mala.settings_sound')}
          value={prefs.soundEnabled}
          onValueChange={onSoundChange}
        />
        <SheetDivider color={borderInput} />

        <SettingsToggleRow
          icon={Vibrate}
          label={t('mala.settings_vibration')}
          value={prefs.vibrationEnabled}
          onValueChange={onVibrationChange}
        />
        <SheetDivider color={borderInput} />

        <SettingsActionRow
          icon={ArrowsClockwise}
          label={t('mala.settings_reset')}
          onPress={handleReset}
          destructive
        />
      </View>
    </AppBottomSheet>
  );
}
