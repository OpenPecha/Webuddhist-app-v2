import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { avatarCacheKey } from '@/lib/username-validation';
import { resolveProfileAvatarUrl } from '@/lib/profile-display';
import { useUserProfile } from '@/hooks/api/useUserProfile';
import { useGuest } from '@/providers/guest';
import { Bell, House, UserCircle, UsersThree, type IconProps } from 'phosphor-react-native';
import { Image } from 'expo-image';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useCSSVariable, useUniwind } from 'uniwind';

/** Icon 24 + gap 2 + label ~14 + top padding 8 — matches Flutter AppBottomNavBar content height */
export const TAB_BAR_CONTENT_HEIGHT = 48;

const TAB_INACTIVE_LIGHT = '#757575';
const TAB_INACTIVE_DARK = '#9E9E9E';

const TAB_ORDER = ['index', 'practice', 'connect', 'me'] as const;

type TabRouteName = (typeof TAB_ORDER)[number];

type TabIcon = ComponentType<IconProps>;

const TAB_ICONS: Record<TabRouteName, TabIcon> = {
  index: House,
  practice: Bell,
  connect: UsersThree,
  me: UserCircle,
};

export function AppBottomTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const { t } = useTranslation();
  const { theme } = useUniwind();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { data: profile } = useUserProfile();
  const isDark = theme === 'dark';
  const cardBackground = String(useCSSVariable('--color-card') ?? '#fdfdfc');
  const activeColor = isDark ? '#ffffff' : '#000000';
  const inactiveColor = isDark ? TAB_INACTIVE_DARK : TAB_INACTIVE_LIGHT;
  const meAvatarUrl =
    user && !isGuest ? resolveProfileAvatarUrl(profile, user) : null;

  const labels: Record<TabRouteName, string> = {
    index: t('nav.home'),
    practice: t('nav.practice'),
    connect: t('nav.connect'),
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
          const showMeAvatar = name === 'me' && !!meAvatarUrl;

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
              {showMeAvatar ? (
                <Image
                  source={{ uri: meAvatarUrl }}
                  recyclingKey={avatarCacheKey(meAvatarUrl)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: isFocused ? 2 : 0,
                    borderColor: activeColor,
                  }}
                  contentFit="cover"
                />
              ) : (
                <Icon size={24} color={color} weight={isFocused ? 'fill' : 'regular'} />
              )}
              <View style={{ height: 2 }} />
              <Text
                className={cn('text-xs', isFocused ? 'font-bold' : 'font-normal')}
                style={{ color }}
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
