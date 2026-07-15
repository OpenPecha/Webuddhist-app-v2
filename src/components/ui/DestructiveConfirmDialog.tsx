import { dialogColors, dialogLayout, dialogTypography } from '@/components/ui/dialog-styles';
import { Modal, Pressable, Text, View } from 'react-native';

interface DestructiveConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

/** Matches Flutter `DestructiveConfirmationDialog` — stacked outlined pill buttons. */
export function DestructiveConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: DestructiveConfirmDialogProps) {
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
            <Pressable
              onPress={onConfirm}
              style={{
                marginTop: 24,
                height: dialogLayout.buttonHeight,
                borderRadius: dialogLayout.radiusButton,
                borderWidth: 1,
                borderColor: dialogColors.destructive,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...dialogTypography.button, color: dialogColors.destructive }}>
                {confirmLabel}
              </Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              style={{
                marginTop: 12,
                height: dialogLayout.buttonHeight,
                borderRadius: dialogLayout.radiusButton,
                borderWidth: 1,
                borderColor: dialogColors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ ...dialogTypography.button, color: dialogColors.text }}>
                {cancelLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
