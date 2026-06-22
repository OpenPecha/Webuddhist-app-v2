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
      <View style={{ paddingHorizontal: 12 }}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          <View style={{ backgroundColor: GOLD_LIGHT, paddingHorizontal: 14, paddingVertical: 20 }}>
            <View
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                backgroundColor: '#fff',
              }}
            >
              <VerseOfDayContent
                verse={verse}
                typography={{
                  ...typography,
                  verseColor: '#212121',
                  attributionColor: '#212121',
                }}
              />
            </View>
            <View style={{ marginTop: 24, alignItems: 'center' }}>
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

      <View style={{ marginTop: 32, paddingHorizontal: 32, paddingBottom: 8 }}>
        <Pressable
          onPress={shareQuote}
          disabled={sharing}
          style={({ pressed }) => ({
            height: 52,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.12)',
            backgroundColor: isDark ? '#353535' : '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: pressed || sharing ? 0.85 : 1,
          })}
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
