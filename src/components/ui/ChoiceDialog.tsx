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
        className="flex-1 justify-center bg-black/40 p-6"
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="rounded-2xl bg-background px-6 pb-5 pt-7">
            <Text className="text-[17px] font-bold tracking-tight text-foreground">{title}</Text>
            <Text className="mt-3 text-sm leading-[21px] text-foreground">{message}</Text>
            <View className="mt-6 flex-row items-center justify-end gap-2">
              <Pressable onPress={onSecondary} className="px-3 py-2.5">
                <Text className="text-[15px] text-foreground">{secondaryLabel}</Text>
              </Pressable>
              <Pressable
                onPress={onPrimary}
                className="rounded-lg bg-[#f87171] px-4 py-2.5"
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
