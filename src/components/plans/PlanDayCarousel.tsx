import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { formatCarouselDayLabel } from '@/utils/plan-utils';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export interface PlanDayCarouselItem {
  day_number: number;
  id?: string;
}

interface PlanDayCarouselProps {
  days: PlanDayCarouselItem[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  completionMap?: Record<number, boolean>;
  disabledDays?: Set<number>;
  readOnly?: boolean;
  startDate?: Date | null;
}

export function PlanDayCarousel({
  days,
  selectedDay,
  onSelectDay,
  completionMap,
  disabledDays,
  startDate,
}: PlanDayCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const sorted = [...days].sort((a, b) => a.day_number - b.day_number);

  useEffect(() => {
    const index = sorted.findIndex((d) => d.day_number === selectedDay);
    const itemWidth = 88;
    if (index >= 0) {
      scrollRef.current?.scrollTo({ x: Math.max(0, index * itemWidth - itemWidth), animated: true });
    }
  }, [selectedDay, sorted]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16 }}
    >
      {sorted.map((day) => {
        const isSelected = day.day_number === selectedDay;
        const isCompleted = completionMap?.[day.day_number] === true;
        const isDisabled = disabledDays?.has(day.day_number) ?? false;
        const label = formatCarouselDayLabel(startDate ?? null, day.day_number);
        const isSelectedActive = isSelected && !isDisabled;

        return (
          <Pressable
            key={day.id ?? day.day_number}
            disabled={isDisabled}
            onPress={() => onSelectDay(day.day_number)}
            className={cn(
              'w-20 h-20 mx-1 rounded-lg items-center justify-center border-2',
              isSelectedActive ? 'bg-white border-black' : 'bg-[#f0f0ec] border-[#f0f0ec]',
              isDisabled ? 'opacity-45' : 'active:opacity-75',
            )}
          >
            {isCompleted ? (
              <View className="absolute top-1 right-1">
                <Ionicons name="checkmark" size={14} color="#16a34a" />
              </View>
            ) : null}
            <Text
              className={cn(
                'text-base font-bold',
                isDisabled ? 'text-muted-foreground' : 'text-foreground',
              )}
            >
              {day.day_number}
            </Text>
            <View
              className={cn(
                'mt-1',
                isSelectedActive && 'px-2 py-0.5 rounded-xl bg-black',
              )}
            >
              <Text
                className={cn(
                  'text-[11px] font-medium',
                  isSelectedActive
                    ? 'text-white'
                    : isDisabled
                      ? 'text-muted-foreground'
                      : 'text-foreground',
                )}
              >
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
