import { ArrowRightIcon, BookOpenTextIcon, ListChecksIcon } from '@/components/home/HomeIcon';
import { Text } from '@/components/ui/text';
import { AppColors } from '@/constants/app-colors';
import type { RoutineInfo } from '@/types/routine-info';
import type { ReactNode } from 'react';
import { useTranslate } from '@tolgee/react';
import { Pressable, View } from 'react-native';

interface MyPracticesStatsCardProps {
  routineInfo: RoutineInfo;
  onPress: () => void;
}

function StatItem({
  icon,
  count,
  label,
}: {
  icon: ReactNode;
  count: number;
  label: string;
}) {
  const countText = String(count);
  const countIndex = label.indexOf(countText);

  return (
    <View className="flex-1 flex-row items-center gap-2.5">
      {icon}
      <Text className="flex-1 text-white">
        {countIndex >= 0 ? (
          <>
            <Text className="text-sm text-white">{label.slice(0, countIndex)}</Text>
            <Text className="text-[22px] font-bold text-white">{countText}</Text>
            <Text className="text-sm text-white">{label.slice(countIndex + countText.length)}</Text>
          </>
        ) : (
          <Text className="text-sm text-white">{label}</Text>
        )}
      </Text>
    </View>
  );
}

export function MyPracticesStatsCard({ routineInfo, onPress }: MyPracticesStatsCardProps) {
  const { t } = useTranslate();

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 overflow-hidden rounded-3xl active:opacity-92"
      style={{ backgroundColor: AppColors.blue }}
    >
      <View className="p-5">
        <View className="flex-row items-start">
          <Text className="flex-1 text-lg font-bold text-white">{t('routine_title')}</Text>
          <Pressable
            onPress={onPress}
            className="h-8 w-8 items-center justify-center rounded-full bg-white"
          >
            <ArrowRightIcon size={18} color={AppColors.blue} weight="bold" />
          </Pressable>
        </View>
        <Text className="mt-1 text-sm text-white/85">{t('home_overall_stats')}</Text>
        <View className="mt-4 flex-row gap-2">
          <StatItem
            icon={<ListChecksIcon size={22} color="#fff" />}
            count={routineInfo.seriesCount}
            label={t('home_plans_count', { count: routineInfo.seriesCount })}
          />
          <StatItem
            icon={<BookOpenTextIcon size={22} color="#fff" />}
            count={routineInfo.recitationCount}
            label={t('home_recitation_count', {
              count: routineInfo.recitationCount,
            })}
          />
        </View>
      </View>
    </Pressable>
  );
}
