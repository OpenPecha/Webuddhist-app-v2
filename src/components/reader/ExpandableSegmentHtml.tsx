import { SegmentHtml } from '@/components/reader/SegmentHtml';
import { Text } from '@/components/ui/text';
import { segmentPlainText } from '@/utils/segment-plain-text';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { useTranslate } from '@tolgee/react';

const PREVIEW_MAX_LENGTH = 150;

interface ExpandableSegmentHtmlProps {
  html: string;
  fontSize: number;
}

/** Segment HTML with MORE/LESS truncation (Flutter ReaderPanelContentBlock parity). */
export function ExpandableSegmentHtml({ html, fontSize }: ExpandableSegmentHtmlProps) {
  const { t } = useTranslate();
  const [expanded, setExpanded] = useState(false);

  const plain = segmentPlainText(html);
  const isToggleable = plain.length > PREVIEW_MAX_LENGTH;

  if (!isToggleable) {
    return (
      <SegmentHtml html={html} fontSize={fontSize} color="#333" fontFamily="Georgia" />
    );
  }

  if (!expanded) {
    return (
      <Text
        className="text-[#333]"
        style={{ fontSize, lineHeight: fontSize * 1.6, fontFamily: 'Georgia' }}
      >
        {`${plain.slice(0, PREVIEW_MAX_LENGTH).trimEnd()}… `}
        <Text onPress={() => setExpanded(true)} className="font-bold text-[#0066cc]">
          {t('settings_section_more')}
        </Text>
      </Text>
    );
  }

  return (
    <>
      <SegmentHtml html={html} fontSize={fontSize} color="#333" fontFamily="Georgia" />
      <Pressable onPress={() => setExpanded(false)} className="mt-1 self-end active:opacity-80">
        <Text className="font-bold text-[#0066cc]" style={{ fontSize }}>
          {t('less')}
        </Text>
      </Pressable>
    </>
  );
}
