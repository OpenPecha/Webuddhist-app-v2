import { SegmentHtml } from '@/components/reader/SegmentHtml';
import { segmentPlainText } from '@/utils/segment-plain-text';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

const PREVIEW_MAX_LENGTH = 150;

interface ExpandableSegmentHtmlProps {
  html: string;
  fontSize: number;
}

/** Segment HTML with MORE/LESS truncation (Flutter ReaderPanelContentBlock parity). */
export function ExpandableSegmentHtml({ html, fontSize }: ExpandableSegmentHtmlProps) {
  const { t } = useTranslation();
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
      <Text style={{ fontSize, lineHeight: fontSize * 1.6, color: '#333', fontFamily: 'Georgia' }}>
        {`${plain.slice(0, PREVIEW_MAX_LENGTH).trimEnd()}… `}
        <Text
          onPress={() => setExpanded(true)}
          style={{ color: '#0066cc', fontWeight: '700', fontFamily: 'Inter-Bold' }}
        >
          {t('reader.more')}
        </Text>
      </Text>
    );
  }

  return (
    <>
      <SegmentHtml html={html} fontSize={fontSize} color="#333" fontFamily="Georgia" />
      <Pressable onPress={() => setExpanded(false)} style={{ alignSelf: 'flex-end', marginTop: 4 }}>
        <Text style={{ color: '#0066cc', fontWeight: '700', fontFamily: 'Inter-Bold', fontSize }}>
          {t('reader.less')}
        </Text>
      </Pressable>
    </>
  );
}
