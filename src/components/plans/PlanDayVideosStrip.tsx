import type { DayVideoSummary } from '@/types/plan-catalog';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, ScrollView, View } from 'react-native';
import { useTranslate } from '@tolgee/react';

interface PlanDayVideosStripProps {
  videos: DayVideoSummary[];
}

export function PlanDayVideosStrip({ videos }: PlanDayVideosStripProps) {
  const { t } = useTranslate();
  if (!videos.length) return null;

  const sorted = [...videos].sort((a, b) => a.display_order - b.display_order);

  const openVideo = (url: string) => {
    void WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      controlsColor: '#000000',
    });
  };

  return (
    <View className="my-2">
      <Text className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase px-5 mb-3">
        {t('plan_shorts_title')}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      >
        {sorted.map((video) => (
          <Pressable
            key={video.id}
            onPress={() => openVideo(video.url)}
            className="w-[120px] active:opacity-75"
          >
            <View className="w-[120px] h-[180px] rounded-xl bg-black items-center justify-center">
              <Ionicons name="play-circle" size={36} color="#fff" />
            </View>
            {video.title ? (
              <Text className="text-xs mt-1.5 text-[#333]" numberOfLines={2}>
                {video.title}
              </Text>
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
