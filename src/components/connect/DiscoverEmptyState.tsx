import { useThemeColors } from '@/hooks/useThemeColors';
import { UsersThree } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export function DiscoverEmptyState() {
  const { t } = useTranslation();
  const { foreground, mutedForeground } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 32, paddingVertical: 32 }}>
      <UsersThree size={48} color={mutedForeground} weight="duotone" />
      <Text
        style={{
          marginTop: 16,
          fontSize: 16,
          fontWeight: '700',
          fontFamily: 'Inter-Bold',
          color: foreground,
          textAlign: 'center',
        }}
      >
        {t('connect.empty_title')}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 15,
          color: mutedForeground,
          textAlign: 'center',
          lineHeight: 22,
        }}
      >
        {t('connect.empty_subtitle')}
      </Text>
    </View>
  );
}
