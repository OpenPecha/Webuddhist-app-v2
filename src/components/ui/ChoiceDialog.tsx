import { dialogColors, dialogLayout } from '@/components/ui/dialog-styles';
import { Text } from '@/components/ui/text';
import { Modal, Pressable, View } from 'react-native';

interface ChoiceDialogProps {
  visible: boolean;
  title: string;
  message: string;
  secondaryLabel: string;
  primaryLabel: string;
  onSecondary: () => void;
  onPrimary: () => void;
  onClose: () => void;
}

/** Matches Flutter `AlertDialog` actions row (empty-block dialog on Done). */
export function ChoiceDialog({
  visible,
  title,
  message,
  secondaryLabel,
  primaryLabel,
  onSecondary,
  onPrimary,
  onClose,
}: ChoiceDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: dialogColors.backdrop, justifyContent: 'center', padding: 24 }}
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={{
              backgroundColor: dialogColors.surface,
              borderRadius: dialogLayout.radiusCard,
              ...dialogLayout.paddingCard,
            }}
          >
            <Text className="text-[17px] font-bold tracking-tight text-foreground">{title}</Text>
            <Text className="mt-3 text-sm leading-[21px] text-foreground">{message}</Text>
            <View
              style={{
                marginTop: 24,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Pressable onPress={onSecondary} style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
                <Text className="text-[15px] text-foreground">{secondaryLabel}</Text>
              </Pressable>
              <Pressable
                onPress={onPrimary}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: dialogColors.destructive,
                }}
              >
                <Text className="text-[15px] font-semibold text-white">{primaryLabel}</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
