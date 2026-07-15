import { dialogColors, dialogLayout, dialogTypography } from '@/components/ui/dialog-styles';
import { Modal, Pressable, Text, View } from 'react-native';

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
            <Text style={dialogTypography.title}>{title}</Text>
            <Text style={{ ...dialogTypography.message, marginTop: 12 }}>{message}</Text>
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
                <Text style={{ ...dialogTypography.button, color: dialogColors.text }}>
                  {secondaryLabel}
                </Text>
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
                <Text style={{ ...dialogTypography.button, color: '#fff', fontWeight: '600' }}>
                  {primaryLabel}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
