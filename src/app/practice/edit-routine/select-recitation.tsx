import { APP_ASSETS } from '@/constants/app-assets';
import { useRecitations } from '@/hooks/api/useRecitations';
import { setPendingRoutineItem } from '@/stores/edit-routine-selection';
import type { RoutineItem } from '@/types/routine';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SelectRecitationScreen() {
  const { blockLocalId } = useLocalSearchParams<{ blockLocalId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, isLoading } = useRecitations();

  const onSelect = (recitation: { text_id: string; title: string }) => {
    const item: RoutineItem = {
      id: recitation.text_id,
      title: recitation.title,
      coverImage: null,
      type: 'recitation',
    };
    setPendingRoutineItem(blockLocalId, item);
    router.back();
  };

  const recitations = data?.recitations ?? [];

  return (
    <View className="flex-1 bg-[#FDFDFC]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center p-2">
        <Pressable onPress={() => router.back()} className="p-2 active:opacity-70">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text className="flex-1 text-center text-[17px] font-semibold text-foreground">
          {t('editRoutine.select_recitation_title')}
        </Text>
        <View className="w-10" />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={recitations}
          keyExtractor={(item) => item.text_id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text className="mt-6 text-center text-muted-foreground">
              {t('editRoutine.no_recitations')}
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelect(item)}
              className="flex-row items-center gap-3 py-3 active:opacity-70"
            >
              <Image
                source={item.image_url ? { uri: item.image_url } : APP_ASSETS.recitationCoverDefault}
                style={{ width: 56, height: 56, borderRadius: 8 }}
              />
              <Text className="flex-1 text-base font-medium text-foreground">{item.title}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
