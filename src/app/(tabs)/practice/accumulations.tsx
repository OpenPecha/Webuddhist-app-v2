import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { PracticeAccumulationCircleItem } from '@/components/practice/explore/PracticeAccumulationCircleItem';
import { PracticeAccumulationsGridSkeleton } from '@/components/practice/explore/PracticeExploreSkeletons';
import { Text } from '@/components/ui/text';
import { useMalaPresets } from '@/hooks/api/useMalaPresets';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGuest } from '@/providers/guest';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PracticeAccumulationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslate();
  const language = useContentLanguage();
  const { foreground } = useThemeColors();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const {
    visible: loginDrawerVisible,
    session: loginDrawerSession,
    showLoginDrawer,
    hideLoginDrawer,
  } = useLoginDrawer();

  const { data: mantras = [], isLoading, isError, isRefetching, refetch } = useMalaPresets();

  const openMala = (presetId: string) => {
    if (isGuest || !user) {
      showLoginDrawer();
      return;
    }
    router.push({ pathname: '/mala', params: { initialPresetId: presetId } });
  };

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
          {t('accumulations')}
        </Text>
        <View className="h-12 w-12" />
      </View>

      {isLoading ? (
        <PracticeAccumulationsGridSkeleton />
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 p-6">
          <Text className="text-center text-destructive">{t('mala_count_load_error')}</Text>
          <Pressable onPress={() => void refetch()} className="p-3 active:opacity-70">
            <Text className="font-semibold text-foreground">{t('retry')}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={mantras}
          keyExtractor={(item) => item.presetId}
          numColumns={2}
          contentContainerClassName="grow px-4 pt-2"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
          }
          ListEmptyComponent={
            <View className="px-6 pt-12">
              <Text className="text-center text-[15px] text-muted-foreground">
                {t('mala_no_mantras')}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="w-1/2 items-center py-4">
              <PracticeAccumulationCircleItem
                mantra={item}
                language={language}
                onPress={() => openMala(item.presetId)}
                circleSize={64}
                width={150}
              />
            </View>
          )}
        />
      )}

      <LoginDrawer
        key={loginDrawerSession}
        visible={loginDrawerVisible}
        onClose={hideLoginDrawer}
      />
    </View>
  );
}
