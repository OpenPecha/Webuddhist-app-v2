import '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth0 } from 'react-native-auth0';
import { useGuest } from '@/providers/guest';

export default function MeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { user } = useAuth0();
  const { isGuest } = useGuest();

  const displayName = user?.name ?? user?.email ?? (isGuest ? 'Guest' : '');

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <Text style={{ fontSize: 26, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000' }}>
          {t('nav.me')}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {displayName ? (
          <Text style={{ fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#000' }}>
            {displayName}
          </Text>
        ) : null}
        <Text style={{ fontSize: 16, color: '#8a8a8a', fontFamily: 'Inter-Regular' }}>
          Coming soon
        </Text>
      </View>
    </View>
  );
}
