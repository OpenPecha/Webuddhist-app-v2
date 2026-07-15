import { MarkdownText } from '@/components/common/MarkdownText';
import { GP_PADDING } from '@/components/group-profile/group-profile-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

interface GroupProfileAboutTabProps {
  content: string;
}

export function GroupProfileAboutTab({ content }: GroupProfileAboutTabProps) {
  const { t } = useTranslation();
  const { mutedForeground } = useThemeColors();

  if (!content.trim()) {
    return (
      <Text style={{ color: mutedForeground, textAlign: 'center', marginTop: 24, paddingHorizontal: GP_PADDING }}>
        {t('connect.no_about')}
      </Text>
    );
  }

  return (
    <View style={{ paddingHorizontal: GP_PADDING, paddingTop: 16 }}>
      <MarkdownText content={content} />
    </View>
  );
}
