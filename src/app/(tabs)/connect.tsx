import '@/lib/i18n';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConnectScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { foreground, mutedForeground, scaffoldBackground } = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: scaffoldBackground,
        paddingTop: insets.top,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          fontFamily: 'Inter-Bold',
          color: foreground,
          textAlign: 'center',
        }}
      >
        {t('nav.connect')}
      </Text>
      <Text
        style={{
          marginTop: 12,
          fontSize: 16,
          fontFamily: 'Inter-Regular',
          color: mutedForeground,
          textAlign: 'center',
        }}
      >
        {t('connect.coming_soon')}
      </Text>
    </View>
  );
}
