import { ArrowLeftIcon } from '@/components/home/HomeIcon';
import { MoonPhaseIcon } from '@/components/home/MoonPhaseIcon';
import { useCalendarMonth } from '@/hooks/api/useCalendarMonth';
import { useCalendarToday } from '@/hooks/api/useCalendarToday';
import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/utils/cn';
import type { CalendarDay } from '@/types/calendar';
import { moonPhaseForLunarDay } from '@/utils/moon-phase';
import { useRouter } from 'expo-router';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import { Text } from '@/components/ui/text';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslate } from '@tolgee/react';

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
  const { t } = useTranslate();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const { foreground, isDark, cardSurface, cardBorder } =
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
    <View className={cn('flex-1', isDark ? 'bg-black' : 'bg-[#FBF9F4]')} style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-2 py-2">
        <Pressable onPress={() => router.back()} className="p-2 active:opacity-70">
          <ArrowLeftIcon size={24} color={foreground} />
        </Pressable>
        <Text className="flex-1 text-center text-[17px] font-semibold text-foreground">
          {t('calendar_title')}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {todayData ? (
          <View
            className="flex-row items-center gap-4 rounded-2xl border p-4"
            style={{ borderColor: cardBorder, backgroundColor: cardSurface }}
          >
            <MoonPhaseIcon phase={moonPhaseForLunarDay(todayData.lunarDay)} size={48} />
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">
                {`Day ${todayData.lunarDay} · Month ${todayData.lunarMonth}`}
              </Text>
              {todayData.monthDesignation ? (
                <Text className="mt-1 text-sm text-muted-foreground">
                  {todayData.monthDesignation}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        <View className="h-4" />

        <View className="flex-row items-center justify-between">
          <Pressable onPress={goPrevMonth} className="p-2 active:opacity-70">
            <CaretLeft size={22} color={foreground} />
          </Pressable>
          <Text className="text-base font-semibold text-foreground">
            {monthLabel}
          </Text>
          <Pressable onPress={goNextMonth} className="p-2 active:opacity-70">
            <CaretRight size={22} color={foreground} />
          </Pressable>
        </View>

        <View className="h-2" />

        <View
          className="rounded-2xl border px-2 py-3"
          style={{ borderColor: cardBorder, backgroundColor: cardSurface }}
        >
          <View className="mb-2 flex-row">
            {WEEKDAY_LABELS.map((label) => (
              <View key={label} className="flex-1 items-center">
                <Text className="text-[11px] font-semibold text-muted-foreground">
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {isLoading ? (
            <View className="items-center py-12">
              <ActivityIndicator />
            </View>
          ) : isError ? (
            <View className="items-center gap-3 p-6">
              <Text className="text-center text-muted-foreground">{t('loadFailed')}</Text>
              <Pressable
                onPress={() => void refetch()}
                className="rounded-lg bg-[#0C53C5] px-4 py-2 active:opacity-70"
              >
                <Text className="text-white">{t('retry')}</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row flex-wrap">
              {cells.map((cell, index) => {
                if (!cell) {
                  return <View key={`empty-${index}`} className="h-[58px] w-[14.285714%]" />;
                }

                const { date, day } = cell;
                const selected = isToday(date);
                const lunarDay = day?.lunarDay ?? 0;

                return (
                  <View
                    key={`${date.toISOString()}-${index}`}
                    className={cn(
                      'h-[58px] w-[14.285714%] items-center justify-center rounded-lg',
                      selected ? 'bg-[#0C53C5]/10' : '',
                    )}
                  >
                    <Text
                      className={`text-sm ${selected ? 'font-bold text-[#0C53C5]' : 'font-medium text-foreground'}`}
                    >
                      {date.getDate()}
                    </Text>
                    {lunarDay > 0 ? (
                      <Text className="mt-0.5 text-[11px] text-muted-foreground">
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
