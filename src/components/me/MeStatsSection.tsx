import { MeStreakCard } from '@/components/me/MeStreakCard';
import { StreakShareSheet } from '@/components/me/StreakShareSheet';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCompactCount } from '@/lib/format-compact-count';
import type { UserStats } from '@/types/user-stats';
import { CirclesThree, ListChecks, Timer } from 'phosphor-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

interface StatCardProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  unit: string;
}

function StatCard({ label, icon, value, unit }: StatCardProps) {
  const { mutedForeground } = useThemeColors();

  return (
    <View className="flex-1 rounded-2xl border border-border bg-card p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs" style={{ color: mutedForeground }}>
          {label}
        </Text>
        {icon}
      </View>
      <Text className="mt-3 text-xl font-bold">
        {value}
        <Text className="text-xs font-normal" style={{ color: mutedForeground }}>
          {' '}
          {unit}
        </Text>
      </Text>
    </View>
  );
}

interface MeStatsSectionProps {
  stats: UserStats;
}

export function MeStatsSection({ stats }: MeStatsSectionProps) {
  const { t, i18n } = useTranslation();
  const { foreground } = useThemeColors();
  const [shareVisible, setShareVisible] = useState(false);
  const timerMinutes = Math.round(stats.totalTimer / 60000);

  return (
    <View className="px-5 pb-6 pt-6">
      <Text className="text-xl font-extrabold">{t('me.my_stats')}</Text>
      <View className="mt-3">
        <MeStreakCard streak={stats.streak} onPress={() => setShareVisible(true)} />
      </View>
      <View className="mt-3 flex-row gap-3">
        <StatCard
          label={t('me.accumulation')}
          icon={<CirclesThree size={22} color={foreground} />}
          value={formatCompactCount(stats.totalAccumulated, i18n.language)}
          unit={t('me.counts')}
        />
        <StatCard
          label={t('home.timer')}
          icon={<Timer size={22} color={foreground} />}
          value={formatCompactCount(timerMinutes, i18n.language)}
          unit={t('me.minutes')}
        />
      </View>
      <View className="mt-3 flex-row items-center rounded-2xl border border-border bg-card px-4 py-5">
        <Text className="flex-1 text-base">
          <Text className="text-xl font-bold">{stats.totalPracticeDays}</Text>
          {' '}
          {t('me.days_plan_practiced_suffix')}
        </Text>
        <ListChecks size={24} color={foreground} />
      </View>

      <StreakShareSheet
        visible={shareVisible}
        streak={stats.streak}
        onClose={() => setShareVisible(false)}
      />
    </View>
  );
}
