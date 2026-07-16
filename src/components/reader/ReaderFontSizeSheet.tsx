import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
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
      style={{
        flex: 1,
        height: 56,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.12)',
        backgroundColor: enabled ? '#f0f0ec' : 'rgba(240,240,236,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enabled ? 1 : 0.5,
      }}
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
  const { t } = useTranslation();

  return (
    <AppBottomSheet visible={visible} onClose={onClose} maxHeight="30%" placement="fullscreen">
      <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        <Text className="text-center text-[13px] text-muted-foreground mb-4">
          {t('reader.font_size')} · {fontSize}px
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
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
