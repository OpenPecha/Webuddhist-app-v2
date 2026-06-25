import { formatCarouselDayLabel } from '@/utils/plan-utils';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

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
  variant?: 'pill' | 'card';
}

export function PlanDayCarousel({
  days,
  selectedDay,
  onSelectDay,
  completionMap,
  disabledDays,
  startDate,
  variant = 'pill',
}: PlanDayCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const sorted = [...days].sort((a, b) => a.day_number - b.day_number);

  useEffect(() => {
    const index = sorted.findIndex((d) => d.day_number === selectedDay);
    const itemWidth = variant === 'card' ? 88 : 72;
    if (index >= 0) {
      scrollRef.current?.scrollTo({ x: Math.max(0, index * itemWidth - itemWidth), animated: true });
    }
  }, [selectedDay, sorted, variant]);

  if (variant === 'card') {
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
          const unselectedBg = '#f0f0ec';

          return (
            <Pressable
              key={day.id ?? day.day_number}
              disabled={isDisabled}
              onPress={() => onSelectDay(day.day_number)}
              style={({ pressed }) => ({
                width: 80,
                height: 80,
                marginHorizontal: 4,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelectedActive ? '#fff' : unselectedBg,
                borderWidth: 2,
                borderColor: isSelectedActive ? '#000' : unselectedBg,
                opacity: isDisabled ? 0.45 : pressed ? 0.75 : 1,
              })}
            >
              {isCompleted ? (
                <View style={{ position: 'absolute', top: 4, right: 4 }}>
                  <Ionicons name="checkmark" size={14} color="#16a34a" />
                </View>
              ) : null}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  fontFamily: 'Inter-Bold',
                  color: isDisabled ? '#8a8a8a' : '#000',
                }}
              >
                {day.day_number}
              </Text>
              <View
                style={
                  isSelectedActive
                    ? {
                        marginTop: 4,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 12,
                        backgroundColor: '#000',
                      }
                    : { marginTop: 4 }
                }
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '500',
                    fontFamily: 'Inter-Medium',
                    color: isSelectedActive ? '#fff' : isDisabled ? '#8a8a8a' : '#000',
                  }}
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

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 8 }}
    >
      {sorted.map((day) => {
        const isSelected = day.day_number === selectedDay;
        const isCompleted = completionMap?.[day.day_number] === true;
        const isDisabled = disabledDays?.has(day.day_number) ?? false;
        const label = formatCarouselDayLabel(startDate ?? null, day.day_number);

        return (
          <Pressable
            key={day.id ?? day.day_number}
            disabled={isDisabled}
            onPress={() => onSelectDay(day.day_number)}
            style={({ pressed }) => ({
              minWidth: 56,
              height: 56,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
              backgroundColor: isSelected ? '#000' : '#f0f0ec',
              opacity: isDisabled ? 0.35 : pressed ? 0.75 : 1,
            })}
          >
            {isCompleted ? (
              <Ionicons name="checkmark" size={18} color={isSelected ? '#fff' : '#000'} />
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  fontFamily: 'Inter-SemiBold',
                  color: isSelected ? '#fff' : '#000',
                }}
              >
                {label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
