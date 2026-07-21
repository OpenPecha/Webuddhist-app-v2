import { ShareNetworkIcon } from '@/components/home/HomeIcon';
import {
  VerseOfDayContent,
  verseTypographyForContext,
} from '@/components/home/VerseOfDayContent';
import { VerseShareSheet } from '@/components/home/VerseShareSheet';
import type { VerseOfDay } from '@/types/verse-of-day';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useState } from 'react';
import { Pressable } from 'react-native';

interface VerseOfDayCardProps {
  verse: VerseOfDay;
}

export function VerseOfDayCard({ verse }: VerseOfDayCardProps) {
  const language = useContentLanguage();
  const { cardSurface, mutedForeground } = useThemeColors();
  const [shareVisible, setShareVisible] = useState(false);
  const typography = verseTypographyForContext(language, 'card');

  return (
    <>
      <Pressable
        onPress={() => setShareVisible(true)}
        className="mx-4 overflow-hidden rounded-3xl active:opacity-[0.92]"
        style={{ backgroundColor: cardSurface }}
      >
        <VerseOfDayContent
          verse={verse}
          typography={typography}
          footerAction={<ShareNetworkIcon size={22} color={mutedForeground} />}
        />
      </Pressable>

      <VerseShareSheet
        visible={shareVisible}
        verse={verse}
        onClose={() => setShareVisible(false)}
      />
    </>
  );
}
