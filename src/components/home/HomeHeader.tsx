import { Text } from '@/components/ui/text';
import { CalendarDotsIcon } from '@/components/home/HomeIcon';
import { StreakShareSheet } from '@/components/me/StreakShareSheet';
import { AppColors } from '@/constants/app-colors';
import { useStreak } from '@/hooks/api/useStreak';
import { useUserStats } from '@/hooks/api/useUserStats';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGuest } from '@/providers/guest';
import { useRouter, type Href } from 'expo-router';
import { Fire } from 'phosphor-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

export function HomeHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const language = useContentLanguage();
  const isTibetan = language === 'bo';
  const { foreground } = useThemeColors();
  const { data: streakCount = 0 } = useStreak();
  const { data: userStats } = useUserStats();
  const [shareVisible, setShareVisible] = useState(false);

  const firstName = user?.given_name ?? user?.name?.split(' ')[0] ?? '';
  const showStreak = !!user && !isGuest;
  const greetingSize = isTibetan ? 18 : 24;

  return (
    <>
      <View className="flex-row items-center justify-between px-5 py-3">
        <Text
          className="flex-1 font-bold text-foreground"
          style={{
            fontSize: greetingSize,
            lineHeight: isTibetan ? greetingSize * 1.2 : undefined,
          }}
          numberOfLines={2}
        >
          {t('home.hello_prefix')}
          {firstName ? firstName : ''}
        </Text>

        <View className="ml-3 flex-row items-center gap-3">
          <Pressable
            onPress={() => router.push('/calendar' as Href)}
            className="active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel={t('home.calendar_accessibility')}
          >
            <CalendarDotsIcon size={24} color={foreground} />
          </Pressable>

          {showStreak && (
            <Pressable
              onPress={() => {
                if (userStats?.streak) setShareVisible(true);
              }}
              className="flex-row items-center active:opacity-70"
              accessibilityRole="button"
            >
              <Fire size={24} color={AppColors.flame} weight="fill" />
              <Text className="ml-1 text-xl font-bold text-foreground">{streakCount}</Text>
            </Pressable>
          )}
        </View>
      </View>

      {userStats?.streak && (
        <StreakShareSheet
          visible={shareVisible}
          streak={userStats.streak}
          onClose={() => setShareVisible(false)}
        />
      )}
    </>
  );
}
