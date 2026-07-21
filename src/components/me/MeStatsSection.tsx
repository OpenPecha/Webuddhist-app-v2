import { AccumulationSheet } from '@/components/me/AccumulationSheet';
import { MeStreakCard } from '@/components/me/MeStreakCard';
import { PracticeDaysSheet } from '@/components/me/PracticeDaysSheet';
import { StreakShareSheet } from '@/components/me/StreakShareSheet';
import { APP_ASSETS } from '@/constants/app-assets';
import { Text } from '@/components/ui/text';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatMeditationDuration } from '@/lib/format-meditation-duration';
import { formatCompactCount } from '@/lib/format-compact-count';
import type { UserStats } from '@/types/user-stats';
import { CirclesThree, ListChecks, Timer } from 'phosphor-react-native';
import { Image } from 'expo-image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

interface StatCardProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  unit?: string;
  onPress?: () => void;
}

function StatCard({ label, icon, value, unit, onPress }: StatCardProps) {
  const content = (
    <>
      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-muted-foreground" numberOfLines={2}>
          {label}
        </Text>
        {icon}
      </View>
      <Text className="mt-3 text-xl font-bold">
        {value}
        {unit ? (
          <Text className="text-xs font-normal text-muted-foreground">
            {' '}
            {unit}
          </Text>
        ) : null}
      </Text>
    </>
  );

  if (!onPress) {
    return <View className="flex-1 rounded-2xl border border-border bg-card p-4">{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 rounded-2xl border border-border bg-card p-4 active:opacity-90"
    >
      {content}
    </Pressable>
  );
}

interface PracticeDaysCardProps {
  days: number;
  onPress: () => void;
}

function PracticeDaysCard({ days, onPress }: PracticeDaysCardProps) {
  const { t } = useTranslation();
  const { foreground } = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-2xl border border-border bg-card px-4 py-5 active:opacity-90"
    >
      <ListChecks size={24} color={foreground} />
      <Text className="ml-3 flex-1 text-base">
        <Text className="text-xl font-bold">{days}</Text>
        {' '}
        {t('me.days_plan_practiced_suffix')}
      </Text>
    </Pressable>
  );
}

interface MeStatsSectionProps {
  stats: UserStats;
}

export function MeStatsSection({ stats }: MeStatsSectionProps) {
  const { t, i18n } = useTranslation();
  const language = useContentLanguage();
  const { foreground } = useThemeColors();
  const [shareVisible, setShareVisible] = useState(false);
  const [practiceDaysVisible, setPracticeDaysVisible] = useState(false);
  const [accumulationVisible, setAccumulationVisible] = useState(false);

  const formattedAccumulation = formatCompactCount(stats.totalAccumulated, i18n.language);
  const meditationDuration = formatMeditationDuration(stats.totalTimer, {
    language,
    minuteLabel: t('me.minutes'),
    hourLabel: t('me.hours'),
  });

  return (
    <View className="px-5 pb-6 pt-6">
      <Text className="text-xl font-extrabold">{t('me.my_stats')}</Text>
      <View className="mt-3">
        <MeStreakCard streak={stats.streak} onPress={() => setShareVisible(true)} />
      </View>
      <View className="mt-3">
        <PracticeDaysCard
          days={stats.totalPracticeDays}
          onPress={() => setPracticeDaysVisible(true)}
        />
      </View>
      <View className="mt-3 flex-row gap-3">
        <StatCard
          label={t('me.accumulation')}
          icon={
            <Image
              source={APP_ASSETS.malaIcon}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
              tintColor={foreground}
            />
          }
          value={formattedAccumulation}
          unit={t('me.counts')}
          onPress={() => setAccumulationVisible(true)}
        />
        <StatCard
          label={t('me.total_meditation_time')}
          icon={<Timer size={22} color={foreground} />}
          value={meditationDuration}
        />
      </View>

      <StreakShareSheet
        visible={shareVisible}
        streak={stats.streak}
        onClose={() => setShareVisible(false)}
      />
      <PracticeDaysSheet
        visible={practiceDaysVisible}
        totalDays={stats.totalPracticeDays}
        onClose={() => setPracticeDaysVisible(false)}
      />
      <AccumulationSheet
        visible={accumulationVisible}
        formattedTotal={formattedAccumulation}
        onClose={() => setAccumulationVisible(false)}
      />
    </View>
  );
}
