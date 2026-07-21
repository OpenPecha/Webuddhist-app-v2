import { CalendarDotsIcon } from '@/components/home/HomeIcon';
import { HomeCalendarCardSkeleton } from '@/components/home/HomeCalendarCardSkeleton';
import { MoonPhaseIcon } from '@/components/home/MoonPhaseIcon';
import { useCalendarToday } from '@/hooks/api/useCalendarToday';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  moonPhaseForLunarDay,
  showsMoonPhaseLabel,
  type MoonPhase,
} from '@/utils/moon-phase';
import { useRouter, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

function moonPhaseLabelKey(phase: MoonPhase): string | null {
  switch (phase) {
    case 'newMoon':
      return 'calendar.moon_phase_new_moon';
    case 'firstQuarter':
      return 'calendar.moon_phase_first_quarter';
    case 'fullMoon':
      return 'calendar.moon_phase_full_moon';
    default:
      return null;
  }
}

export function HomeCalendarCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const language = useContentLanguage();
  const isTibetan = language === 'bo';
  const { data: day, isLoading, isError } = useCalendarToday();
  const { foreground, mutedForeground, cardSurface, cardBorder } = useThemeColors();

  if ((isLoading || isError) && !day) {
    return <HomeCalendarCardSkeleton />;
  }

  if (!day) return null;

  const phase = moonPhaseForLunarDay(day.lunarDay);
  const phaseLabelKey = moonPhaseLabelKey(phase);

  return (
    <Pressable
      onPress={() => router.push('/calendar' as Href)}
      className="mx-4 rounded-3xl border active:opacity-90"
      style={{ borderColor: cardBorder, backgroundColor: cardSurface }}
    >
      <View className="flex-row items-center px-4 py-2">
        <MoonPhaseIcon phase={phase} size={44} />
        <View className="w-4" />
        <View className="flex-1">
          <Text
            style={{
              fontSize: isTibetan ? 15 : 16,
              fontWeight: '700',
              fontFamily: 'Inter-Bold',
              color: foreground,
            }}
          >
            {t('home.calendar_day_month', {
              day: day.lunarDay,
              month: day.lunarMonth,
            })}
          </Text>
          {phaseLabelKey && showsMoonPhaseLabel(phase) ? (
            <Text
              style={{
                marginTop: 2,
                fontSize: 14,
                color: mutedForeground,
                fontFamily: 'Inter-Regular',
              }}
              numberOfLines={1}
            >
              {t(phaseLabelKey)}
            </Text>
          ) : null}
        </View>
        <CalendarDotsIcon size={24} color={foreground} />
      </View>
    </Pressable>
  );
}
