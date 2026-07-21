import { GP_DESCRIPTION_CLAMP } from '@/components/group-profile/group-profile-styles';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

interface GroupProfileDescriptionProps {
  description: string;
}

export function GroupProfileDescription({ description }: GroupProfileDescriptionProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!description.trim()) return null;

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      className="px-4 pt-3 active:opacity-80"
    >
      <Text
        className="text-[15px] leading-[22px] text-foreground"
        numberOfLines={expanded ? undefined : GP_DESCRIPTION_CLAMP}
      >
        {description}
      </Text>
      {description.length > 120 ? (
        <Text className="mt-1 text-[13px] font-semibold text-foreground">
          {expanded ? t('connect.show_less') : t('connect.show_more')}
        </Text>
      ) : null}
    </Pressable>
  );
}
