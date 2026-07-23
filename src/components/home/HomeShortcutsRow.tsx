import { Text } from '@/components/ui/text';
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
import { useTranslate } from '@tolgee/react';
import { CirclesThree } from 'phosphor-react-native';
import { Image, Pressable, View } from 'react-native';

const ICON_SIZE = 28;

interface ShortcutTileProps {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  cardColor: string;
}

function ShortcutTile({ icon, label, onPress, cardColor }: ShortcutTileProps) {
  return (
    <Pressable
      onPress={onPress}
      className="aspect-square flex-1 rounded-2xl active:opacity-85"
      style={{ backgroundColor: cardColor }}
    >
      <View className="flex-1 items-center justify-center px-2 py-4">
        {icon}
        <View className="flex-1 justify-center">
          <Text className="text-center text-sm font-semibold text-foreground" numberOfLines={2}>
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
  const { t } = useTranslate();
  const router = useRouter();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const { foreground, shortcutCard } = useThemeColors();

  const showComingSoon = () => showAppToast("Coming soon.");

  const openGated = (route: '/mala' | '/timers') => {
    if (isGuest) {
      showLoginDrawer();
      return;
    }
    router.push(route as Href);
  };

  return (
    <>
      <View className="flex-row gap-2 px-4">
        <ShortcutTile
          icon={<ListChecksIcon size={ICON_SIZE} color={foreground} />}
          label={t('home_shortcut_plans')}
          onPress={() => router.push('/plans' as Href)}
          cardColor={shortcutCard}
        />
        <ShortcutTile
          icon={<BookOpenTextIcon size={ICON_SIZE} color={foreground} />}
          label={t('home_chants')}
          onPress={showComingSoon}
          cardColor={shortcutCard}
        />
        <ShortcutTile
          icon={<MalaShortcutIcon color={foreground} />}
          label={t('home_mala')}
          onPress={() => openGated('/mala')}
          cardColor={shortcutCard}
        />
        <ShortcutTile
          icon={<TimerIcon size={ICON_SIZE} color={foreground} />}
          label={t('home_timer')}
          onPress={() => openGated('/timers')}
          cardColor={shortcutCard}
        />
      </View>
      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </>
  );
}
