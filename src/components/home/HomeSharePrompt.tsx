import { ShareNetworkIcon } from '@/components/home/HomeIcon';
import { shareApp } from '@/services/app-share';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

export function HomeSharePrompt() {
  const { t } = useTranslation();
  const { foreground, mutedForeground, sharePromptBg } = useThemeColors();

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 16,
          color: mutedForeground,
          fontFamily: 'Inter-Regular',
        }}
      >
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
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            fontFamily: 'Inter-Bold',
            color: foreground,
          }}
        >
          {t('home.share')}
        </Text>
      </Pressable>
    </View>
  );
}
