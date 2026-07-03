import { ExpandableSegmentHtml } from '@/components/reader/ExpandableSegmentHtml';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useSegmentCommentaries } from '@/hooks/api/useSegmentCommentaries';
import type { SegmentCommentary } from '@/types/segment-commentary';
import { groupByLanguage, languageDisplayName } from '@/utils/segment-resource-grouping';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

interface SegmentCommentaryPanelProps {
  segmentId: string;
  fontSize?: number;
}

function CommentaryItem({ commentary, fontSize }: { commentary: SegmentCommentary; fontSize: number }) {
  const content = commentary.segments
    .map((s) => s.content.trim())
    .filter(Boolean)
    .join('\n\n');

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#000', marginBottom: 8 }}>
        {commentary.title}
      </Text>
      {content ? <ExpandableSegmentHtml html={content} fontSize={fontSize} /> : null}
      {commentary.source ? (
        <Text style={{ fontSize: 11, color: '#8a8a8a', marginTop: 8 }}>{commentary.source}</Text>
      ) : null}
      {commentary.license ? (
        <Text style={{ fontSize: 11, color: '#8a8a8a', marginTop: 4 }}>{commentary.license}</Text>
      ) : null}
    </View>
  );
}

export function SegmentCommentaryPanel({ segmentId, fontSize = 16 }: SegmentCommentaryPanelProps) {
  const { t } = useTranslation();
  const contentLanguage = useContentLanguage();
  const { data, isLoading, isError, refetch } = useSegmentCommentaries(segmentId);

  if (isLoading) {
    return (
      <View style={{ paddingVertical: 32, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ paddingVertical: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: '#8a8a8a', marginBottom: 12 }}>
          {t('reader.load_error')}
        </Text>
        <Pressable onPress={() => void refetch()}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#000' }}>{t('practice.retry')}</Text>
        </Pressable>
      </View>
    );
  }

  const commentaries = data?.commentaries ?? [];
  if (commentaries.length === 0) {
    return (
      <View style={{ paddingVertical: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: '#8a8a8a' }}>{t('reader.no_commentary')}</Text>
      </View>
    );
  }

  const groups = groupByLanguage(commentaries, contentLanguage);

  return (
    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
      {groups.map((group) => (
        <View key={group.language || 'unknown'} style={{ marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: '#8a8a8a',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            {`${languageDisplayName(group.language)} (${group.items.length})`}
          </Text>
          {group.items.map((commentary, index) => (
            <CommentaryItem
              key={`${group.language}-${commentary.textId}-${commentary.title}-${index}`}
              commentary={commentary}
              fontSize={fontSize}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
