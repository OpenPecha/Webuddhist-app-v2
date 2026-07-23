import { MarkdownText } from '@/components/common/MarkdownText';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { useTranslate } from '@tolgee/react';

interface GroupProfileAboutTabProps {
  content: string;
}

export function GroupProfileAboutTab({ content }: GroupProfileAboutTabProps) {
  const { t } = useTranslate();
  if (!content.trim()) {
    return (
      <Text className="mt-6 px-4 text-center text-muted-foreground">{t('reader_no_version_info')}</Text>
    );
  }

  return (
    <View className="px-4 pt-4">
      <MarkdownText content={content} />
    </View>
  );
}
