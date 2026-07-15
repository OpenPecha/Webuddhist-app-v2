import type { ReactNode } from 'react';
import { useState } from 'react';
import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { APP_ASSETS } from '@/constants/app-assets';
import { BookOpenTextIcon, ListChecksIcon, TimerIcon } from '@/components/home/HomeIcon';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGuest } from '@/providers/guest';
import { showAppToast } from '@/utils/show-app-toast';
import { useRouter, type Href } from 'expo-router';
import { CirclesThree } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text, View } from 'react-native';

const BORDER_RADIUS = 16;
const ICON_SIZE = 28;

interface ShortcutTileProps {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  cardColor: string;
  labelColor: string;
}

function ShortcutTile({ icon, label, onPress, cardColor, labelColor }: ShortcutTileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        aspectRatio: 1,
        borderRadius: BORDER_RADIUS,
        backgroundColor: cardColor,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 8,
          paddingVertical: 16,
        }}
      >
        {icon}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 14,
              fontWeight: '600',
              fontFamily: 'Inter-SemiBold',
              color: labelColor,
            }}
            numberOfLines={2}
          >
            {label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function MalaShortcutIcon({ color }: { color: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <CirclesThree size={ICON_SIZE} color={color} weight="fill" />;
  }

  return (
    <Image
      source={APP_ASSETS.malaIcon}
      style={{ width: ICON_SIZE, height: ICON_SIZE, tintColor: color }}
      resizeMode="contain"
      onError={() => setFailed(true)}
    />
  );
}

export function HomeShortcutsRow() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const { foreground, shortcutCard } = useThemeColors();

  const showComingSoon = () => showAppToast(t('home.shortcut_coming_soon'));

  const openGated = (route: '/mala' | '/timers') => {
    if (isGuest) {
      showLoginDrawer();
      return;
    }
    router.push(route as Href);
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        <ShortcutTile
          icon={<ListChecksIcon size={ICON_SIZE} color={foreground} />}
          label={t('home.home_shortcut_plans')}
          onPress={showComingSoon}
          cardColor={shortcutCard}
          labelColor={foreground}
        />
        <ShortcutTile
          icon={<BookOpenTextIcon size={ICON_SIZE} color={foreground} />}
          label={t('home.home_chants')}
          onPress={showComingSoon}
          cardColor={shortcutCard}
          labelColor={foreground}
        />
        <ShortcutTile
          icon={<MalaShortcutIcon color={foreground} />}
          label={t('home.home_mala')}
          onPress={() => openGated('/mala')}
          cardColor={shortcutCard}
          labelColor={foreground}
        />
        <ShortcutTile
          icon={<TimerIcon size={ICON_SIZE} color={foreground} />}
          label={t('home.timer')}
          onPress={() => openGated('/timers')}
          cardColor={shortcutCard}
          labelColor={foreground}
        />
      </View>
      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </>
  );
}
