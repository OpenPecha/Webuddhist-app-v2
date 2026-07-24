import { MarkdownText } from '@/components/common/MarkdownText';
import { Text } from '@/components/ui/text';
import { useTranslate } from '@tolgee/react';
import { View } from 'react-native';

interface GroupProfileAboutTabProps {
  content: string;
}

export function GroupProfileAboutTab({ content }: GroupProfileAboutTabProps) {
  const { t } = useTranslate();

  if (!content.trim()) {
    return (
      <Text className="mt-6 px-4 text-center text-muted-foreground">{t('group_no_about', "No description available.")}</Text>
    );
  }

  return (
    <View className="px-4 pt-4">
      <MarkdownText content={content} />
    </View>
  );
}
