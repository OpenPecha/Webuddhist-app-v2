import { ArrowRightIcon, BookOpenTextIcon, ListChecksIcon } from '@/components/home/HomeIcon';
import { AppColors } from '@/constants/app-colors';
import { Text } from '@/components/ui/text';
import type { RoutineInfo } from '@/types/routine-info';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
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
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      {icon}
      <Text className="flex-1 text-white">
        {countIndex >= 0 ? (
          <>
            <Text className="text-sm">{label.slice(0, countIndex)}</Text>
            <Text className="text-[22px] font-bold">{countText}</Text>
            <Text className="text-sm">{label.slice(countIndex + countText.length)}</Text>
          </>
        ) : (
          <Text className="text-sm">{label}</Text>
        )}
      </Text>
    </View>
  );
}

export function MyPracticesStatsCard({ routineInfo, onPress }: MyPracticesStatsCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        marginHorizontal: 16,
        borderRadius: 24,
        backgroundColor: AppColors.blue,
        opacity: pressed ? 0.92 : 1,
        overflow: 'hidden',
      })}
    >
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Text className="flex-1 text-lg font-bold text-white">{t('home.my_practices_title')}</Text>
          <Pressable
            onPress={onPress}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowRightIcon size={18} color={AppColors.blue} weight="bold" />
          </Pressable>
        </View>
        <Text className="mt-1 text-sm text-white/85">{t('home.home_overall_stats')}</Text>
        <View style={{ marginTop: 16, flexDirection: 'row', gap: 8 }}>
          <StatItem
            icon={<ListChecksIcon size={22} color="#fff" />}
            count={routineInfo.seriesCount}
            label={t('home.home_plans_count', { count: routineInfo.seriesCount })}
          />
          <StatItem
            icon={<BookOpenTextIcon size={22} color="#fff" />}
            count={routineInfo.recitationCount}
            label={t('home.home_recitation_count', {
              count: routineInfo.recitationCount,
            })}
          />
        </View>
      </View>
    </Pressable>
  );
}
