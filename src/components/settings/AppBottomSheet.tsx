import { useThemeColors } from '@/hooks/useThemeColors';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Flutter-style bottom drawer with drag handle. */
export function AppBottomSheet({ visible, onClose, children }: AppBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { mutedForeground } = useThemeColors();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="rounded-t-[20px] bg-background"
          style={{ paddingBottom: insets.bottom + 8, maxHeight: '70%' }}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="items-center pt-2 pb-3">
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: mutedForeground,
                opacity: 0.35,
              }}
            />
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
