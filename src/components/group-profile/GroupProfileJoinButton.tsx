import { GP_JOIN_HEIGHT, GP_JOIN_RADIUS, GP_PADDING } from '@/components/group-profile/group-profile-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text } from 'react-native';

interface GroupProfileJoinButtonProps {
  isActive: boolean;
  isPage: boolean;
  pending: boolean;
  onPress: () => void;
}

export function GroupProfileJoinButton({
  isActive,
  isPage,
  pending,
  onPress,
}: GroupProfileJoinButtonProps) {
  const { t } = useTranslation();
  const { foreground, scaffoldBackground, shortcutCard, isDark } = useThemeColors();

  const label = isActive
    ? isPage
      ? t('connect.following')
      : t('connect.joined')
    : isPage
      ? t('connect.follow')
      : t('connect.join');

  const activeBg = isActive ? shortcutCard : foreground;
  const activeFg = isActive ? foreground : isDark ? foreground : scaffoldBackground;

  return (
    <Pressable
      onPress={onPress}
      disabled={pending}
      style={({ pressed }) => ({
        marginHorizontal: GP_PADDING,
        marginTop: 20,
        height: GP_JOIN_HEIGHT,
        borderRadius: GP_JOIN_RADIUS,
        backgroundColor: activeBg,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed || pending ? 0.75 : 1,
      })}
    >
      {pending ? (
        <ActivityIndicator size="small" color={activeFg} />
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: activeFg,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
