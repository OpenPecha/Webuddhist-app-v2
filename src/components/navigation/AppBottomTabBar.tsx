import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { Bell, House, UserCircle, type IconProps } from 'phosphor-react-native';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useCSSVariable, useUniwind } from 'uniwind';

/** Icon 24 + gap 2 + label ~14 + top padding 8 — matches Flutter AppBottomNavBar content height */
export const TAB_BAR_CONTENT_HEIGHT = 48;

const TAB_INACTIVE_LIGHT = '#757575';
const TAB_INACTIVE_DARK = '#9E9E9E';

const TAB_ORDER = ['index', 'practice', 'me'] as const;

type TabRouteName = (typeof TAB_ORDER)[number];

type TabIcon = ComponentType<IconProps>;

const TAB_ICONS: Record<TabRouteName, TabIcon> = {
  index: House,
  practice: Bell,
  me: UserCircle,
};

export function AppBottomTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const { t } = useTranslation();
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const cardBackground = String(useCSSVariable('--color-card') ?? '#fdfdfc');
  const activeColor = isDark ? '#ffffff' : '#000000';
  const inactiveColor = isDark ? TAB_INACTIVE_DARK : TAB_INACTIVE_LIGHT;

  const labels: Record<TabRouteName, string> = {
    index: t('nav.home'),
    practice: t('nav.practice'),
    me: t('nav.me'),
  };

  return (
    <View style={{ backgroundColor: cardBackground }}>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 8,
          paddingBottom: insets.bottom,
        }}
      >
        {TAB_ORDER.map((name) => {
          const route = state.routes.find((r) => r.name === name);
          if (!route) return null;

          const routeIndex = state.routes.indexOf(route);
          const isFocused = state.index === routeIndex;
          const color = isFocused ? activeColor : inactiveColor;
          const Icon = TAB_ICONS[name];

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}
            >
              <Icon size={24} color={color} weight={isFocused ? 'fill' : 'regular'} />
              <View style={{ height: 2 }} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: isFocused ? '700' : '400',
                  color,
                  fontFamily: 'Inter-Regular',
                }}
              >
                {labels[name]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
