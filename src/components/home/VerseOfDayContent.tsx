import type { VerseOfDay } from '@/types/verse-of-day';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors'
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Text, View, type TextStyle } from 'react-native';

export interface VerseOfDayTypography {
  verseFontSize: number;
  fontWeight?: TextStyle['fontWeight'];
  attributionFontSize: number;
  imageAspectRatio: number;
  textPaddingHorizontal: number;
  textPaddingTop: number;
  textPaddingBottom: number;
  verseColor?: string;
  attributionColor?: string;
}

interface VerseOfDayContentProps {
  verse: VerseOfDay;
  typography: VerseOfDayTypography;
  footerAction?: ReactNode;
}

export function verseTypographyForContext(
  language: string,
  context: 'card' | 'sheet',
): VerseOfDayTypography {

  const isTibetan = language === 'bo';
  if (context === 'sheet') {
    return {
      verseFontSize: isTibetan ? 20 : 18,
      fontWeight: isTibetan ? "bold" : "800",
      attributionFontSize: isTibetan ? 16 : 15,
      imageAspectRatio: 1.15,
      textPaddingHorizontal: 28,
      textPaddingTop: 32,
      textPaddingBottom: 36,
    };
  }

  return {
    verseFontSize: isTibetan ? 18 : 16,
    fontWeight: isTibetan ? "bold" : "600",
    attributionFontSize: isTibetan ? 14 : 13,
    imageAspectRatio: 1.65,
    textPaddingHorizontal: 24,
    textPaddingTop: 24,
    textPaddingBottom: 16,
  };
}

export function VerseOfDayContent({ verse, typography, footerAction }: VerseOfDayContentProps) {

  const language = useContentLanguage();
  const isTibetan = language === 'bo';
  const { foreground, mutedForeground } = useThemeColors();
  const verseColor = typography.verseColor ?? foreground;
  const attributionColor = typography.attributionColor ?? mutedForeground;

  const attribution =
    verse.groupInfo[0]?.title ?? verse.groupInfo[0]?.subTitle ?? '';
  return (

    <View>
      {verse.imageUrl ? (
        <Image
          source={{ uri: verse.imageUrl }}
          style={{ width: '100%', aspectRatio: typography.imageAspectRatio }}
          contentFit="cover"
        />
      ) : null}

      <View
        style={{
          paddingHorizontal: typography.textPaddingHorizontal,
          paddingTop: typography.textPaddingTop,
          paddingBottom: typography.textPaddingBottom,
        }}
      >

        <View style={{ paddingBottom: footerAction ? 32 : 0 }}>
          <Text
            style={{
              fontSize: typography.verseFontSize,
              lineHeight: typography.verseFontSize * 1.5,
              fontFamily: isTibetan ? 'Inter-Regular' : 'EBGaramond-Regular',
              color: verseColor,
            }}
          >
            {verse.verse}
          </Text>

          {attribution ? (
            <Text
              style={{
                marginTop: 12,
                fontSize: typography.attributionFontSize,
                fontFamily: isTibetan ? 'Inter-Regular' : 'EBGaramond-Regular',
                color: attributionColor,
                textAlign: 'center',
                fontWeight: typography.fontWeight,
              }}
            >
              ~ {attribution}
            </Text>
          ) : null}
        </View>

        {footerAction ? (
          <View style={{ position: 'absolute', right: 16, bottom: 16 }}>{footerAction}</View>
        ) : null}
      </View>
    </View>
  );
}
