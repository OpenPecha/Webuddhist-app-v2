import {
  GP_BODY_SIZE,
  GP_DESCRIPTION_CLAMP,
  GP_PADDING,
} from '@/components/group-profile/group-profile-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

interface GroupProfileDescriptionProps {
  description: string;
}

export function GroupProfileDescription({ description }: GroupProfileDescriptionProps) {
  const { t } = useTranslation();
  const { foreground } = useThemeColors();
  const [expanded, setExpanded] = useState(false);

  if (!description.trim()) return null;

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      style={{ paddingHorizontal: GP_PADDING, paddingTop: 12 }}
    >
      <Text
        style={{ fontSize: GP_BODY_SIZE, color: foreground, lineHeight: 22 }}
        numberOfLines={expanded ? undefined : GP_DESCRIPTION_CLAMP}
      >
        {description}
      </Text>
      {description.length > 120 ? (
        <Text style={{ fontSize: 13, color: foreground, fontWeight: '600', marginTop: 4 }}>
          {expanded ? t('connect.show_less') : t('connect.show_more')}
        </Text>
      ) : null}
    </Pressable>
  );
}
