import '@/lib/i18n';
import { ArrowLeftIcon } from '@/components/home/HomeIcon';
import { MoonPhaseIcon } from '@/components/home/MoonPhaseIcon';
import { AppColors } from '@/constants/app-colors';
import { useCalendarMonth } from '@/hooks/api/useCalendarMonth';
import { useCalendarToday } from '@/hooks/api/useCalendarToday';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { CalendarDay } from '@/types/calendar';
import { moonPhaseForLunarDay } from '@/utils/moon-phase';
import { useRouter } from 'expo-router';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function parseGregorianDate(raw: string | null): Date | null {
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function buildMonthGrid(year: number, month: number, days: CalendarDay[]) {
  const byDate = new Map<string, CalendarDay>();
  for (const day of days) {
    const parsed = parseGregorianDate(day.gregorianDate);
    if (!parsed) continue;
    const key = `${parsed.getFullYear()}-${parsed.getMonth()}-${parsed.getDate()}`;
    byDate.set(key, day);
  }

  const firstOfMonth = new Date(year, month - 1, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: ({ date: Date; day: CalendarDay | null } | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    cells.push({ date, day: byDate.get(key) ?? null });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function CalendarScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const { foreground, mutedForeground, scaffoldBackground, cardSurface, cardBorder } =
    useThemeColors();

  const { data: monthData, isLoading, isError, refetch } = useCalendarMonth(year, month);
  const { data: todayData } = useCalendarToday();

  const cells = useMemo(
    () => buildMonthGrid(year, month, monthData?.days ?? []),
    [year, month, monthData?.days],
  );

  const monthLabel = useMemo(
    () => new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    [year, month],
  );

  const goPrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
      return;
    }
    setMonth((m) => m - 1);
  };

  const goNextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
      return;
    }
    setMonth((m) => m + 1);
  };

  const isToday = (date: Date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return (
    <View style={{ flex: 1, backgroundColor: scaffoldBackground, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <ArrowLeftIcon size={24} color={foreground} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: foreground,
            textAlign: 'center',
          }}
        >
          {t('calendar.title')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {todayData ? (
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: cardBorder,
              backgroundColor: cardSurface,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <MoonPhaseIcon phase={moonPhaseForLunarDay(todayData.lunarDay)} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: foreground, fontFamily: 'Inter-Bold' }}>
                {t('home.calendar_day_month', {
                  day: todayData.lunarDay,
                  month: todayData.lunarMonth,
                })}
              </Text>
              {todayData.monthDesignation ? (
                <Text style={{ marginTop: 4, fontSize: 14, color: mutedForeground }}>
                  {todayData.monthDesignation}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        <View style={{ height: 16 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={goPrevMonth} style={{ padding: 8 }}>
            <CaretLeft size={22} color={foreground} />
          </Pressable>
          <Text style={{ fontSize: 16, fontWeight: '600', color: foreground, fontFamily: 'Inter-SemiBold' }}>
            {monthLabel}
          </Text>
          <Pressable onPress={goNextMonth} style={{ padding: 8 }}>
            <CaretRight size={22} color={foreground} />
          </Pressable>
        </View>

        <View style={{ height: 8 }} />

        <View
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: cardBorder,
            backgroundColor: cardSurface,
            paddingVertical: 12,
            paddingHorizontal: 8,
          }}
        >
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {WEEKDAY_LABELS.map((label) => (
              <View key={label} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: mutedForeground, fontFamily: 'Inter-SemiBold' }}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {isLoading ? (
            <View style={{ paddingVertical: 48, alignItems: 'center' }}>
              <ActivityIndicator />
            </View>
          ) : isError ? (
            <View style={{ padding: 24, alignItems: 'center', gap: 12 }}>
              <Text style={{ color: mutedForeground, textAlign: 'center' }}>{t('home.load_error')}</Text>
              <Pressable
                onPress={() => void refetch()}
                style={{ backgroundColor: AppColors.blue, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}
              >
                <Text style={{ color: '#fff' }}>{t('practice.retry')}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {cells.map((cell, index) => {
                if (!cell) {
                  return <View key={`empty-${index}`} style={{ width: `${100 / 7}%`, height: 58 }} />;
                }

                const { date, day } = cell;
                const selected = isToday(date);
                const lunarDay = day?.lunarDay ?? 0;

                return (
                  <View
                    key={`${date.toISOString()}-${index}`}
                    style={{
                      width: `${100 / 7}%`,
                      height: 58,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                      backgroundColor: selected ? `${AppColors.blue}18` : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: selected ? '700' : '500',
                        color: selected ? AppColors.blue : foreground,
                      }}
                    >
                      {date.getDate()}
                    </Text>
                    {lunarDay > 0 ? (
                      <Text style={{ fontSize: 11, color: mutedForeground, marginTop: 2 }}>
                        {lunarDay}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
