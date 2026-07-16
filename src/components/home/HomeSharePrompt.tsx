import { Text } from '@/components/ui/text';
import { ShareNetworkIcon } from '@/components/home/HomeIcon';
import { shareApp } from '@/services/app-share';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

export function HomeSharePrompt() {
  const { t } = useTranslation();
  const { foreground, sharePromptBg } = useThemeColors();

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
      <Text className="text-center text-base text-muted-foreground">
        {t('home.home_share_prompt', { appName: t('appTitle') })}
      </Text>
      <View style={{ height: 12 }} />
      <Pressable
        onPress={() => {
          void shareApp();
        }}
        style={({ pressed }) => ({
          height: 52,
          borderRadius: 12,
          backgroundColor: sharePromptBg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <ShareNetworkIcon size={22} color={foreground} />
        <Text className="text-base font-bold text-foreground">{t('home.share')}</Text>
      </Pressable>
    </View>
  );
}
