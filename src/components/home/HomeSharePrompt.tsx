import { Text } from '@/components/ui/text';
import { ShareNetworkIcon } from '@/components/home/HomeIcon';
import { shareApp } from '@/services/app-share';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslate } from '@tolgee/react';
import { Pressable, View } from 'react-native';

export function HomeSharePrompt() {
  const { t } = useTranslate();
  const { foreground, sharePromptBg } = useThemeColors();

  return (
    <View className="px-5 py-6">
      <Text className="text-center text-base text-muted-foreground">
        {t('home_share_prompt', { appName: t('appTitle') })}
      </Text>
      <View className="h-3" />
      <Pressable
        onPress={() => {
          void shareApp();
        }}
        className="h-[52px] flex-row items-center justify-center gap-2 rounded-xl active:opacity-85"
        style={{ backgroundColor: sharePromptBg }}
      >
        <ShareNetworkIcon size={22} color={foreground} />
        <Text className="text-base font-bold text-foreground">{t('share')}</Text>
      </Pressable>
    </View>
  );
}
