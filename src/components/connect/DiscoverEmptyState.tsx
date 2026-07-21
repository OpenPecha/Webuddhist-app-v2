import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { UsersThree } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export function DiscoverEmptyState() {
  const { t } = useTranslation();
  const { mutedForeground } = useThemeColors();

  return (
    <View className="items-center px-8 py-8">
      <UsersThree size={48} color={mutedForeground} weight="duotone" />
      <Text className="mt-4 text-center text-base font-bold text-foreground">
        {t('connect.empty_title')}
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-[22px] text-muted-foreground">
        {t('connect.empty_subtitle')}
      </Text>
    </View>
  );
}
