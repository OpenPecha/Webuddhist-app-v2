import { GP_PADDING } from '@/components/group-profile/group-profile-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

export type GroupProfileTab = 'practices' | 'about';

interface GroupProfileTabBarProps {
  tab: GroupProfileTab;
  onTabChange: (tab: GroupProfileTab) => void;
  showAbout: boolean;
}

export function GroupProfileTabBar({ tab, onTabChange, showAbout }: GroupProfileTabBarProps) {
  const { t } = useTranslation();
  const { foreground, mutedForeground, cardBorder } = useThemeColors();

  const tabs: { key: GroupProfileTab; label: string }[] = [
    { key: 'practices', label: t('connect.tab_practices') },
  ];
  if (showAbout) {
    tabs.push({ key: 'about', label: t('connect.tab_about') });
  }

  return (
    <View style={{ marginTop: 24 }}>
      <View style={{ flexDirection: 'row', paddingHorizontal: GP_PADDING }}>
        {tabs.map(({ key, label }) => {
          const active = tab === key;
          return (
            <Pressable
              key={key}
              onPress={() => onTabChange(key)}
              style={{ marginRight: 24, paddingVertical: 12 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: active ? '700' : '500',
                  fontFamily: active ? 'Inter-Bold' : 'Inter-Medium',
                  color: active ? foreground : mutedForeground,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ height: 1, backgroundColor: cardBorder }} />
    </View>
  );
}
