import { CONNECT_PADDING, CONNECT_SECTION_TITLE } from '@/components/connect/connect-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

export function ConnectHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  const { foreground, mutedForeground } = useThemeColors();

  return (
    <View style={{ paddingHorizontal: CONNECT_PADDING, paddingTop: 16, paddingBottom: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              fontFamily: 'Inter-Bold',
              color: foreground,
            }}
          >
            {t('nav.connect')}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: mutedForeground,
              marginTop: 4,
              lineHeight: 21,
            }}
          >
            {t('connect.subtitle')}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/connect/search')}
          style={({ pressed }) => ({
            padding: 8,
            opacity: pressed ? 0.75 : 1,
          })}
          accessibilityLabel={t('connect.search_placeholder')}
        >
          <MagnifyingGlass size={22} color={foreground} />
        </Pressable>
      </View>
    </View>
  );
}

export function ConnectSectionTitle({ label }: { label: string }) {
  const { foreground } = useThemeColors();

  return (
    <Text
      style={{
        ...CONNECT_SECTION_TITLE,
        color: foreground,
        paddingHorizontal: CONNECT_PADDING,
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
  );
}
