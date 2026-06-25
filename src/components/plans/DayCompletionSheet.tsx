import { imageUrl } from '@/utils/image-url';
import type { ImageSizes } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Modal, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const progress = totalDays > 0 ? dayNumber / totalDays : 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#FDFDFC',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: insets.bottom + 24,
            alignItems: 'center',
          }}
        >
          {planImage ? (
            <Image
              source={{ uri: imageUrl(planImage, 'thumbnail') }}
              style={{ width: 64, height: 64, borderRadius: 8, marginBottom: 16 }}
              contentFit="cover"
            />
          ) : (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#000',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="checkmark" size={28} color="#fff" />
            </View>
          )}
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'Inter-Bold',
              color: '#000',
              marginBottom: 8,
            }}
          >
            {t('planTrack.day_complete_title')}
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
            {t('planTrack.day_of', { day: dayNumber, total: totalDays })}
          </Text>
          <View
            style={{
              width: '100%',
              height: 4,
              backgroundColor: '#e8e8e4',
              borderRadius: 2,
              marginBottom: 24,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${Math.min(100, progress * 100)}%`,
                height: 4,
                backgroundColor: '#000',
              }}
            />
          </View>
          <Pressable
            onPress={onClose}
            style={{
              backgroundColor: '#000',
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 48,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
              {t('planTrack.continue')}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
