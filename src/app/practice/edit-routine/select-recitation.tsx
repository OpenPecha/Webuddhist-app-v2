import { APP_ASSETS } from '@/constants/app-assets';
import { useRecitations } from '@/hooks/api/useRecitations';
import { setPendingRoutineItem } from '@/stores/edit-routine-selection';
import type { RoutineItem } from '@/types/routine';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
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
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center' }}>
          {t('editRoutine.select_recitation_title')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={recitations}
          keyExtractor={(item) => item.text_id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#8a8a8a', marginTop: 24 }}>
              {t('editRoutine.no_recitations')}
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelect(item)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                gap: 12,
              }}
            >
              <Image
                source={item.image_url ? { uri: item.image_url } : APP_ASSETS.recitationCoverDefault}
                style={{ width: 56, height: 56, borderRadius: 8 }}
              />
              <Text style={{ flex: 1, fontSize: 16, fontWeight: '500' }}>{item.title}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
