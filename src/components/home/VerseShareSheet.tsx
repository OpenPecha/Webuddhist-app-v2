import { ShareNetworkIcon } from '@/components/home/HomeIcon';
import {
  VerseOfDayContent,
  verseTypographyForContext,
} from '@/components/home/VerseOfDayContent';
import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { AppColors } from '@/constants/app-colors';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { VerseOfDay } from '@/types/verse-of-day';
import { cn } from '@/utils/cn';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { ShareNetwork } from 'phosphor-react-native';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import ViewShot, { type ViewShotRef } from 'react-native-view-shot';
import { useUniwind } from 'uniwind';

const logo = require('../../../assets/images/webuddhist_gold.png');
const GOLD_LIGHT = AppColors.surfaceLight;

interface VerseShareSheetProps {
  visible: boolean;
  verse: VerseOfDay;
  onClose: () => void;
}

export function VerseShareSheet({ visible, verse, onClose }: VerseShareSheetProps) {
  const { t } = useTranslation();
  const language = useContentLanguage();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const { foreground } = useThemeColors();
  const viewShotRef = useRef<ViewShotRef>(null);
  const [sharing, setSharing] = useState(false);

  const typography = verseTypographyForContext(language, 'sheet');

  const shareQuote = async () => {
    if (sharing || !viewShotRef.current?.capture) return;
    setSharing(true);
    try {
      const uri = await viewShotRef.current.capture();
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert(t('home.verse_share_error'));
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: t('home.share_this_quote'),
      });
    } catch {
      Alert.alert(t('home.verse_share_error'));
    } finally {
      setSharing(false);
    }
  };

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      maxHeight="90%"
      sheetClassName={isDark ? 'bg-[#1c1c1c]' : undefined}
      sheetStyle={
        isDark
          ? undefined
          : {
              backgroundColor: GOLD_LIGHT,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }
      }
    >
      <View className="px-3">
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          <View className="px-3.5 py-5" style={{ backgroundColor: GOLD_LIGHT }}>
            <View className="overflow-hidden rounded-xl bg-white">
              <VerseOfDayContent
                verse={verse}
                typography={{
                  ...typography,
                  verseColor: '#212121',
                  attributionColor: '#212121',
                }}
              />
            </View>
            <View className="mt-6 items-center">
              <Image source={logo} style={{ width: 32, height: 32 }} contentFit="contain" />
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: '#8a8a8a',
                  fontFamily: 'Inter-Regular',
                }}
              >
                {t('me.shared_from')}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#212121',
                  fontFamily: 'Inter-SemiBold',
                }}
              >
                {t('appTitle')}
              </Text>
            </View>
          </View>
        </ViewShot>
      </View>

      <View className="mt-8 px-8 pb-2">
        <Pressable
          onPress={shareQuote}
          disabled={sharing}
          className={cn(
            'h-[52px] flex-row items-center justify-center gap-2 rounded-full border border-black/12 active:opacity-85',
            sharing && 'opacity-85',
          )}
          style={{ backgroundColor: isDark ? '#353535' : '#fff' }}
        >
          {sharing ? (
            <ActivityIndicator color={foreground} />
          ) : (
            <>
              <ShareNetwork size={22} color={foreground} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  fontFamily: 'Inter-Bold',
                  color: foreground,
                }}
              >
                {t('home.share_this_quote')}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </AppBottomSheet>
  );
}
