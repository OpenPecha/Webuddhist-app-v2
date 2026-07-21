import { Text } from '@/components/ui/text';
import { Modal, Pressable, View } from 'react-native';

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
        className="flex-1 justify-center bg-black/40 p-6"
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="rounded-2xl bg-background px-6 pb-5 pt-7">
            <Text className="text-[17px] font-bold tracking-tight text-foreground">{title}</Text>
            <Text className="mt-3 text-sm leading-[21px] text-foreground">{message}</Text>
            <Pressable
              onPress={onConfirm}
              className="mt-6 h-12 items-center justify-center rounded-[30px] border border-[#f87171]"
            >
              <Text className="text-[15px] text-destructive">{confirmLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              className="mt-3 h-12 items-center justify-center rounded-[30px] border border-[#e8e8e4]"
            >
              <Text className="text-[15px] text-foreground">{cancelLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
