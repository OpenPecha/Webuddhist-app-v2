import type { DayVideoSummary } from '@/types/plan-catalog';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

interface PlanDayVideosStripProps {
  videos: DayVideoSummary[];
}

export function PlanDayVideosStrip({ videos }: PlanDayVideosStripProps) {
  const { t } = useTranslation();

  if (!videos.length) return null;

  const sorted = [...videos].sort((a, b) => a.display_order - b.display_order);

  const openVideo = (url: string) => {
    void WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      controlsColor: '#000000',
    });
  };

  return (
    <View style={{ marginTop: 8, marginBottom: 8 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          fontFamily: 'Inter-SemiBold',
          letterSpacing: 1,
          color: '#8a8a8a',
          textTransform: 'uppercase',
          paddingHorizontal: 20,
          marginBottom: 12,
        }}
      >
        {t('plans.videos.title')}
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
            style={({ pressed }) => ({
              width: 120,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <View
              style={{
                width: 120,
                height: 180,
                borderRadius: 12,
                backgroundColor: '#000',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="play-circle" size={36} color="#fff" />
            </View>
            {video.title ? (
              <Text style={{ fontSize: 12, marginTop: 6, color: '#333' }} numberOfLines={2}>
                {video.title}
              </Text>
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
