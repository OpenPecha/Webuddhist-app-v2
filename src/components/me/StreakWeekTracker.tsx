import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Check, Fire } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useUniwind } from 'uniwind';

export enum StreakWeekDayCellState {
  Today = 'today',
  Practiced = 'practiced',
  Missed = 'missed',
  Future = 'future',
}

const FLAME_COLOR = '#E8630A';
const CELL_SIZE = 36;

/** Dart DateTime.weekday: 1 = Monday … 7 = Sunday. */
export function getTodayWeekdayIndex(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay;
}

export function resolveCellState(
  dayIndex: number,
  todayWeekday: number,
  practicedDays: Set<number>,
): StreakWeekDayCellState {
  if (dayIndex === todayWeekday) return StreakWeekDayCellState.Today;
  if (practicedDays.has(dayIndex)) return StreakWeekDayCellState.Practiced;
  if (dayIndex < todayWeekday) return StreakWeekDayCellState.Missed;
  return StreakWeekDayCellState.Future;
}

function weekdayLabel(dayIndex: number, locale: string): string {
  const refMonday = new Date(2024, 0, dayIndex);
  return refMonday.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase();
}

interface WeekDayCellProps {
  state: StreakWeekDayCellState;
  forShare?: boolean;
}

function WeekDayCell({ state, forShare = false }: WeekDayCellProps) {
  const { theme } = useUniwind();
  const isDark = !forShare && theme === 'dark';
  const { foreground } = useThemeColors();

  const surfaceColor = isDark ? '#1c1c1c' : '#ffffff';
  const missedColor = isDark ? '#2a2a2a' : '#d4d4d4';
  const todayBorderColor = isDark ? '#d4d4d4' : foreground;
  const practicedBg = isDark ? '#d4d4d4' : foreground;
  const practicedIcon = isDark ? foreground : '#ffffff';

  if (state === StreakWeekDayCellState.Future) {
    return <View style={{ width: CELL_SIZE, height: CELL_SIZE }} />;
  }

  if (state === StreakWeekDayCellState.Today) {
    return (
      <View
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          borderRadius: 8,
          borderWidth: 1.5,
          borderColor: todayBorderColor,
          backgroundColor: surfaceColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fire size={16} color={FLAME_COLOR} weight="fill" />
      </View>
    );
  }

  if (state === StreakWeekDayCellState.Practiced) {
    return (
      <View
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          borderRadius: 8,
          backgroundColor: practicedBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Check size={16} color={practicedIcon} weight="bold" />
      </View>
    );
  }

  return (
    <View
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRadius: 8,
        backgroundColor: missedColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text className="text-base font-medium text-muted-foreground">—</Text>
    </View>
  );
}

interface StreakWeekTrackerProps {
  practicedDays: number[];
  forShare?: boolean;
}

export function StreakWeekTracker({ practicedDays, forShare = false }: StreakWeekTrackerProps) {
  const { i18n } = useTranslation();
  const todayWeekday = getTodayWeekdayIndex();
  const practicedSet = new Set(practicedDays);

  return (
    <View className="flex-row">
      {Array.from({ length: 7 }, (_, index) => {
        const dayIndex = index + 1;
        const state = resolveCellState(dayIndex, todayWeekday, practicedSet);

        return (
          <View key={dayIndex} className="flex-1 items-center" style={{ marginLeft: index > 0 ? 4 : 0 }}>
            <Text className="text-[10px] font-medium tracking-wide text-muted-foreground">
              {weekdayLabel(dayIndex, i18n.language)}
            </Text>
            <View className="mt-2">
              <WeekDayCell state={state} forShare={forShare} />
            </View>
          </View>
        );
      })}
    </View>
  );
}
