import { AppScreenHeader } from '@/components/settings/AppScreenHeader';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { FileText } from '@/constants/settings-icons';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TERMS_URL = 'https://webuddhist.com/terms-of-service';
const PRIVACY_URL = 'https://webuddhist.com/privacy-policy';

export default function LegalScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <AppScreenHeader title={t('legal.title')} />
      <ScrollView
        contentContainerClassName="px-6 pt-2"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <SettingsRow
          icon={FileText}
          title={t('legal.terms_of_service')}
          trailingIcon="external"
          onPress={() => Linking.openURL(TERMS_URL)}
        />
        <SettingsRow
          icon={FileText}
          title={t('legal.privacy_policy')}
          trailingIcon="external"
          onPress={() => Linking.openURL(PRIVACY_URL)}
        />
      </ScrollView>
    </View>
  );
}
