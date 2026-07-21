import { cn } from '@/utils/cn';
import { AppScreenHeader } from '@/components/settings/AppScreenHeader';
import { Text } from '@/components/ui/text';
import {
  ArrowSquareOut,
  FacebookLogo,
  InstagramLogo,
  LinkSimple,
  TwitterLogo,
  YoutubeLogo,
} from '@/constants/settings-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

const logo = require('../../../../../assets/images/webuddhist_gold.png');

const SOCIAL_LINKS = [
  {
    icon: LinkSimple,
    titleKey: 'about.social_website',
    subtitle: 'www.webuddhist.com',
    url: 'https://webuddhist.com',
  },
  {
    icon: InstagramLogo,
    title: 'Instagram',
    subtitle: '@webuddhist',
    url: 'https://www.instagram.com/webuddhist_?igsh=MXEwajM5dmxkbmYyYQ==',
  },
  {
    icon: FacebookLogo,
    title: 'Facebook',
    subtitle: 'facebook.com/webuddhist',
    url: 'https://www.facebook.com/share/1D9u6rMCsy/',
  },
  {
    icon: TwitterLogo,
    title: 'X (Twitter)',
    subtitle: '@webuddhist',
    url: 'https://x.com/WeBuddhist_',
  },
  {
    icon: YoutubeLogo,
    title: 'YouTube',
    subtitle: '@webuddhist',
    url: 'https://youtube.com/@we_buddhist?si=Re1GiaGDJIEypIva',
  },
] as const;

export default function AboutScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { mutedForeground } = useThemeColors();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';

  return (
    <View className="flex-1 bg-background">
      <AppScreenHeader title={t('about.title')} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View className="px-5 py-6">
          <View className="items-center">
            <Image source={logo} style={{ width: 96, height: 96 }} contentFit="contain" />
            <Text className="mt-4 text-[23px] font-bold">{t('appTitle')}</Text>
          </View>
          <Text className="mt-3 text-justify text-base leading-6">{t('about.description')}</Text>
        </View>

        <View className="px-5">
          <Text className="text-base font-medium text-muted-foreground">
            {t('about.connect_with_us')}
          </Text>
          <View className="mt-4">
            {SOCIAL_LINKS.map((link, index) => {
              const Icon = link.icon;
              const title = 'titleKey' in link ? t(link.titleKey) : link.title;
              return (
                <View key={link.url}>
                  <Pressable
                    onPress={() => Linking.openURL(link.url)}
                    className="flex-row items-center py-3.5 active:opacity-70"
                  >
                    <Icon size={36} color={mutedForeground} />
                    <View className="ml-3.5 flex-1">
                      <Text className="text-base font-medium">{title}</Text>
                      <Text className="text-sm text-muted-foreground">{link.subtitle}</Text>
                    </View>
                    <ArrowSquareOut size={20} color={mutedForeground} />
                  </Pressable>
                  {index < SOCIAL_LINKS.length - 1 ? (
                    <View
                      className={cn('h-px', isDark ? 'bg-[#555]' : 'bg-[#f0f0f0]')}
                    />
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
