import { RecitationListTile } from '@/components/recitation/RecitationListTile';
import { RecitationsListSkeleton } from '@/components/recitation/RecitationsListSkeleton';
import { Text } from '@/components/ui/text';
import { useRecitations } from '@/hooks/api/useRecitations';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RecitationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslate();
  const { foreground } = useThemeColors();

  const { data, isLoading, isError, isRefetching, refetch } = useRecitations();
  const recitations = data?.recitations ?? [];

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-1 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="p-3 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('back')}
        >
          <Ionicons name="chevron-back" size={24} color={foreground} />
        </Pressable>
        <Text
          className="flex-1 text-center text-[17px] font-bold text-foreground"
          numberOfLines={1}
        >
          {t('recitations_title')}
        </Text>
        <Pressable
          onPress={() => router.push('/recitations-search')}
          className="p-3 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('recitations_search_for')}
        >
          <Ionicons name="search" size={22} color={foreground} />
        </Pressable>
      </View>

      {isLoading ? (
        <RecitationsListSkeleton />
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 p-6">
          <Text className="text-center text-destructive">{t('recitations_load_error')}</Text>
          <Pressable onPress={() => void refetch()} className="p-3 active:opacity-70">
            <Text className="font-semibold text-foreground">{t('retry')}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={recitations}
          keyExtractor={(item) => item.text_id}
          contentContainerClassName="grow pt-2"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
          }
          ListEmptyComponent={
            <View className="px-6 pt-12">
              <Text className="text-center text-[15px] text-muted-foreground">
                {t('recitations_no_content')}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <RecitationListTile
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/reader/[textId]',
                  params: { textId: item.text_id },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}
