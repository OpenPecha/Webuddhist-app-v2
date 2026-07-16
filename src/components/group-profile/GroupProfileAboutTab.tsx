import { MarkdownText } from '@/components/common/MarkdownText';
import { GP_PADDING } from '@/components/group-profile/group-profile-styles';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

interface GroupProfileAboutTabProps {
  content: string;
}

export function GroupProfileAboutTab({ content }: GroupProfileAboutTabProps) {
  const { t } = useTranslation();

  if (!content.trim()) {
    return (
      <Text className="mt-6 px-4 text-center text-muted-foreground">{t('connect.no_about')}</Text>
    );
  }

  return (
    <View style={{ paddingHorizontal: GP_PADDING, paddingTop: 16 }}>
      <MarkdownText content={content} />
    </View>
  );
}
