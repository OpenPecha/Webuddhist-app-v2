import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export type GroupProfileTab = 'practices' | 'about';

interface GroupProfileTabBarProps {
  tab: GroupProfileTab;
  onTabChange: (tab: GroupProfileTab) => void;
  showAbout: boolean;
}

export function GroupProfileTabBar({ tab, onTabChange, showAbout }: GroupProfileTabBarProps) {
  const { t } = useTranslation();
  const { cardBorder } = useThemeColors();

  const tabs: { key: GroupProfileTab; label: string }[] = [
    { key: 'practices', label: t('connect.tab_practices') },
  ];
  if (showAbout) {
    tabs.push({ key: 'about', label: t('connect.tab_about') });
  }

  return (
    <View className="mt-6">
      <View className="flex-row px-4">
        {tabs.map(({ key, label }) => {
          const active = tab === key;
          return (
            <Pressable
              key={key}
              onPress={() => onTabChange(key)}
              className="mr-6 py-3"
            >
              <Text
                className={cn(
                  'text-[15px]',
                  active ? 'font-bold text-foreground' : 'font-medium text-muted-foreground',
                )}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View className="h-px" style={{ backgroundColor: cardBorder }} />
    </View>
  );
}
