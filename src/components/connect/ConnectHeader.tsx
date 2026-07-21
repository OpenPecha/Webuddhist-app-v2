import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

export function ConnectHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  const { foreground } = useThemeColors();

  return (
    <View className="px-5 pb-2 pt-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[28px] font-bold text-foreground">{t('nav.connect')}</Text>
          <Text className="mt-1 text-[15px] leading-[21px] text-muted-foreground">
            {t('connect.subtitle')}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/connect/search')}
          className="p-2 active:opacity-75"
          accessibilityLabel={t('connect.search_placeholder')}
        >
          <MagnifyingGlass size={22} color={foreground} />
        </Pressable>
      </View>
    </View>
  );
}

export function ConnectSectionTitle({ label }: { label: string }) {
  return (
    <Text className="mb-2 px-5 text-lg font-bold text-foreground">{label}</Text>
  );
}
