import { ExpandableSegmentHtml } from '@/components/reader/ExpandableSegmentHtml';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useSegmentTranslations } from '@/hooks/api/useSegmentTranslations';
import type { SegmentTranslation } from '@/types/segment-translation';
import { groupByLanguage, languageDisplayName } from '@/utils/segment-resource-grouping';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

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
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#000', marginBottom: 8 }}>
        {translation.title}
      </Text>
      {translation.content ? (
        <ExpandableSegmentHtml html={translation.content} fontSize={fontSize} />
      ) : null}
      {translation.source ? (
        <Text style={{ fontSize: 11, color: '#8a8a8a', marginTop: 8 }}>{translation.source}</Text>
      ) : null}
      {translation.license ? (
        <Text style={{ fontSize: 11, color: '#8a8a8a', marginTop: 4 }}>{translation.license}</Text>
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

  const translations = data?.translations ?? [];
  if (translations.length === 0) {
    return (
      <View style={{ paddingVertical: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: '#8a8a8a' }}>{t('reader.no_translations')}</Text>
      </View>
    );
  }

  const groups = groupByLanguage(translations, contentLanguage);

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
