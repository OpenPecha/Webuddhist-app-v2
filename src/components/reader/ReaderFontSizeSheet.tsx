import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { useTranslate } from '@tolgee/react';
import { Pressable, View } from 'react-native';

interface ReaderFontSizeSheetProps {
  visible: boolean;
  onClose: () => void;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  fontSize: number;
}

function FontSizeButton({
  label,
  labelFontSize,
  enabled,
  onPress,
}: {
  label: string;
  labelFontSize: number;
  enabled: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={enabled ? onPress : undefined}
      className={cn(
        'flex-1 h-14 rounded-lg border border-black/12 items-center justify-center',
        enabled ? 'bg-[#f0f0ec] opacity-100' : 'bg-[#f0f0ec]/50 opacity-50',
      )}
    >
      <Text className="font-medium text-foreground" style={{ fontSize: labelFontSize }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ReaderFontSizeSheet({
  visible,
  onClose,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
  fontSize,
}: ReaderFontSizeSheetProps) {
  const { t } = useTranslate();

  return (
    <AppBottomSheet visible={visible} onClose={onClose} maxHeight="30%" placement="fullscreen">
      <View className="px-6 pb-4">
        <Text className="text-center text-[13px] text-muted-foreground mb-4">
          {t('text_size')} · {fontSize}px
        </Text>
        <View className="flex-row gap-3">
          <FontSizeButton
            label="A"
            labelFontSize={18}
            enabled={canDecrease}
            onPress={onDecrease}
          />
          <FontSizeButton
            label="A"
            labelFontSize={28}
            enabled={canIncrease}
            onPress={onIncrease}
          />
        </View>
      </View>
    </AppBottomSheet>
  );
}
