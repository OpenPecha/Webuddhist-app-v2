import { ExpandableSegmentHtml } from '@/components/reader/ExpandableSegmentHtml';
import { Text } from '@/components/ui/text';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useSegmentCommentaries } from '@/hooks/api/useSegmentCommentaries';
import type { SegmentCommentary } from '@/types/segment-commentary';
import { groupByLanguage, languageDisplayName } from '@/utils/segment-resource-grouping';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

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
    <View className="mb-6">
      <Text className="text-[15px] font-bold text-foreground mb-2">{commentary.title}</Text>
      {content ? <ExpandableSegmentHtml html={content} fontSize={fontSize} /> : null}
      {commentary.source ? (
        <Text className="text-[11px] text-muted-foreground mt-2">{commentary.source}</Text>
      ) : null}
      {commentary.license ? (
        <Text className="text-[11px] text-muted-foreground mt-1">{commentary.license}</Text>
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
      <View className="py-8 items-center">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-6 items-center">
        <Text className="text-sm text-muted-foreground mb-3">{t('reader.load_error')}</Text>
        <Pressable onPress={() => void refetch()}>
          <Text className="text-sm font-semibold text-foreground">{t('practice.retry')}</Text>
        </Pressable>
      </View>
    );
  }

  const commentaries = data?.commentaries ?? [];
  if (commentaries.length === 0) {
    return (
      <View className="py-6 items-center">
        <Text className="text-sm text-muted-foreground">{t('reader.no_commentary')}</Text>
      </View>
    );
  }

  const groups = groupByLanguage(commentaries, contentLanguage);

  return (
    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
      {groups.map((group) => (
        <View key={group.language || 'unknown'} className="mb-2">
          <Text className="text-[13px] font-bold text-muted-foreground uppercase tracking-wide mb-3">
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
