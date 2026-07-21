import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import type { VerseOfDay } from '@/types/verse-of-day';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { View, type TextStyle } from 'react-native';

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
      fontWeight: isTibetan ? 'bold' : '800',
      attributionFontSize: isTibetan ? 16 : 15,
      imageAspectRatio: 1.15,
      textPaddingHorizontal: 28,
      textPaddingTop: 32,
      textPaddingBottom: 36,
    };
  }

  return {
    verseFontSize: isTibetan ? 18 : 16,
    fontWeight: isTibetan ? 'bold' : '600',
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
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [verse.imageUrl]);

  const verseColor = typography.verseColor ?? foreground;
  const attributionColor = typography.attributionColor ?? mutedForeground;

  const attribution =
    verse.groupInfo[0]?.title ?? verse.groupInfo[0]?.subTitle ?? '';
  const showImage = !!verse.imageUrl && !imageFailed;

  return (
    <View>
      <View className="w-full" style={{ aspectRatio: typography.imageAspectRatio }}>
        {showImage ? (
          <Image
            source={{ uri: verse.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            onError={() => setImageFailed(true)}
          />
        ) : null}
      </View>

      <View
        style={{
          paddingHorizontal: typography.textPaddingHorizontal,
          paddingTop: typography.textPaddingTop,
          paddingBottom: typography.textPaddingBottom,
        }}
      >
        <View className={cn(footerAction && 'pb-8')}>
          <Text
            className={cn(!isTibetan && 'font-garamond')}
            style={{
              fontSize: typography.verseFontSize,
              lineHeight: typography.verseFontSize * 1.5,
              color: verseColor,
            }}
          >
            {verse.verse}
          </Text>

          {attribution ? (
            <Text
              className={cn('mt-3 text-center', !isTibetan && 'font-garamond')}
              style={{
                fontSize: typography.attributionFontSize,
                color: attributionColor,
                fontWeight: typography.fontWeight,
              }}
            >
              ~ {attribution}
            </Text>
          ) : null}
        </View>

        {footerAction ? (
          <View className="absolute bottom-4 right-4">{footerAction}</View>
        ) : null}
      </View>
    </View>
  );
}
