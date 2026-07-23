import { Text } from '@/components/ui/text';
import { imageUrl } from '@/utils/image-url';
import type { ImageSizes } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslate } from '@tolgee/react';

interface DayCompletionSheetProps {
  visible: boolean;
  onClose: () => void;
  dayNumber: number;
  totalDays: number;
  planImage?: ImageSizes | null;
}

export function DayCompletionSheet({
    visible,
  onClose,
  dayNumber,
  totalDays,
  planImage,
}: DayCompletionSheetProps) {
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const progress = totalDays > 0 ? dayNumber / totalDays : 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="items-center rounded-t-[20px] bg-[#FDFDFC] px-6 pt-8"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          {planImage ? (
            <Image
              source={{ uri: imageUrl(planImage, 'thumbnail') }}
              style={{ width: 64, height: 64, borderRadius: 8, marginBottom: 16 }}
              contentFit="cover"
            />
          ) : (
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-black">
              <Ionicons name="checkmark" size={28} color="#fff" />
            </View>
          )}
          <Text className="text-xl font-bold text-foreground mb-2">{t('plan_status_on_track')}</Text>
          <Text className="text-sm text-muted-foreground mb-3">
            {`Day ${dayNumber} of ${totalDays}`}
          </Text>
          <View className="mb-6 h-1 w-full overflow-hidden rounded-sm bg-[#e8e8e4]">
            <View
              className="h-1 bg-black"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </View>
          <Pressable
            onPress={onClose}
            className="rounded-xl bg-black px-12 py-3.5 active:opacity-80"
          >
            <Text className="text-white text-base font-semibold">{t('onboarding_continue')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
