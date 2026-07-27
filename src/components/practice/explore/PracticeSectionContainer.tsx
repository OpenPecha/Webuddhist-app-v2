import { Text } from '@/components/ui/text';
import { useTranslate } from '@tolgee/react';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

interface PracticeSectionContainerProps {
  title: string;
  onSeeAll?: () => void;
  children: ReactNode;
}

/** Section title + optional "See all" action, matching Flutter PracticeSectionContainer. */
export function PracticeSectionContainer({
  title,
  onSeeAll,
  children,
}: PracticeSectionContainerProps) {
  const { t } = useTranslate();

  return (
    <View className="pt-5">
      <View className="flex-row items-center justify-between px-4">
        <Text className="text-[18px] font-bold text-foreground">{title}</Text>
        {onSeeAll ? (
          <Pressable
            onPress={onSeeAll}
            hitSlop={8}
            className="active:opacity-70"
            accessibilityRole="button"
          >
            <Text className="text-[14px] font-medium text-foreground">{t('see_all')}</Text>
          </Pressable>
        ) : null}
      </View>
      <View className="h-3" />
      {children}
    </View>
  );
}
