import { useThemeColors } from '@/hooks/useThemeColors';
import { Modal, Pressable, Text, View } from 'react-native';

interface LogoutAlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Matches Flutter settings logout `AlertDialog` — horizontal text actions. */
export function LogoutAlertDialog({
  visible,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: LogoutAlertDialogProps) {
  const { foreground, destructive } = useThemeColors();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/40 px-6"
        onPress={onCancel}
      >
        <Pressable onPress={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-background p-6">
          <Text className="text-xl font-semibold">{title}</Text>
          <Text className="text-foreground mt-3 text-base font-medium">{message}</Text>
          <View className="mt-6 flex-row justify-end gap-4">
            <Pressable onPress={onCancel} className="px-2 py-2 active:opacity-70">
              <Text className="text-base" style={{ color: foreground }}>
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable onPress={onConfirm} className="px-2 py-2 active:opacity-70">
              <Text className="text-base font-medium" style={{ color: destructive }}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
