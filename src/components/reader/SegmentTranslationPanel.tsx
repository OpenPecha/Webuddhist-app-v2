import { ExpandableSegmentHtml } from '@/components/reader/ExpandableSegmentHtml';
import { Text } from '@/components/ui/text';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useSegmentTranslations } from '@/hooks/api/useSegmentTranslations';
import type { SegmentTranslation } from '@/types/segment-translation';
import { groupByLanguage, languageDisplayName } from '@/utils/segment-resource-grouping';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

interface SegmentTranslationPanelProps {
  segmentId: string;
  fontSize?: number;
}

function TranslationItem({
  translation,
  fontSize,
}: {
  translation: SegmentTranslation;
  fontSize: number;
}) {
  return (
    <View className="mb-6">
      <Text className="text-[15px] font-bold text-foreground mb-2">{translation.title}</Text>
      {translation.content ? (
        <ExpandableSegmentHtml html={translation.content} fontSize={fontSize} />
      ) : null}
      {translation.source ? (
        <Text className="text-[11px] text-muted-foreground mt-2">{translation.source}</Text>
      ) : null}
      {translation.license ? (
        <Text className="text-[11px] text-muted-foreground mt-1">{translation.license}</Text>
      ) : null}
    </View>
  );
}

export function SegmentTranslationPanel({ segmentId, fontSize = 16 }: SegmentTranslationPanelProps) {
  const { t } = useTranslation();
  const contentLanguage = useContentLanguage();
  const { data, isLoading, isError, refetch } = useSegmentTranslations(segmentId);

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

  const translations = data?.translations ?? [];
  if (translations.length === 0) {
    return (
      <View className="py-6 items-center">
        <Text className="text-sm text-muted-foreground">{t('reader.no_translations')}</Text>
      </View>
    );
  }

  const groups = groupByLanguage(translations, contentLanguage);

  return (
    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
      {groups.map((group) => (
        <View key={group.language || 'unknown'} className="mb-2">
          <Text className="text-[13px] font-bold text-muted-foreground uppercase tracking-wide mb-3">
            {`${languageDisplayName(group.language)} (${group.items.length})`}
          </Text>
          {group.items.map((translation, index) => (
            <TranslationItem
              key={`${group.language}-${translation.textId}-${translation.title}-${index}`}
              translation={translation}
              fontSize={fontSize}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
