import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ActivityIndicator, Pressable } from 'react-native';

interface GroupProfileJoinButtonProps {
  isActive: boolean;
  isPage: boolean;
  pending: boolean;
  onPress: () => void;
}

import { useTranslate } from '@tolgee/react';

export function GroupProfileJoinButton({
  isActive,
  isPage,
  pending,
  onPress,
}: GroupProfileJoinButtonProps) {
  const { t } = useTranslate();
  const { foreground, scaffoldBackground, shortcutCard, isDark } = useThemeColors();

  const label = isActive
    ? isPage
      ? t('following')
      : t('joined')
    : isPage
      ? t('follow')
      : t('join');

  const activeBg = isActive ? shortcutCard : foreground;
  const activeFg = isActive ? foreground : isDark ? foreground : scaffoldBackground;

  return (
    <Pressable
      onPress={onPress}
      disabled={pending}
      className="mx-4 mt-5 h-12 items-center justify-center rounded-3xl active:opacity-75"
      style={{
        backgroundColor: activeBg,
        opacity: pending ? 0.75 : 1,
      }}
    >
      {pending ? (
        <ActivityIndicator size="small" color={activeFg} />
      ) : (
        <Text className="text-base font-semibold" style={{ color: activeFg }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
