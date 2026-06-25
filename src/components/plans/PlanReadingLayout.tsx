import { MarkdownText } from '@/components/common/MarkdownText';
import { PlanNavigator } from '@/components/plans/PlanNavigator';
import { usePlanAudioPlayer } from '@/components/plans/PlanAudioPlayer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PREVIEW_LINE_LIMIT = 6;

interface PlanReadingLayoutProps {
  content: string;
  sectionTitle: string;
  audioUrl?: string | null;
  autoPlay?: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  headerExtra?: ReactNode;
  footerMeta?: ReactNode;
}

export function PlanReadingLayout({
  content,
  sectionTitle,
  audioUrl,
  autoPlay,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onFinish,
  headerExtra,
  footerMeta,
}: PlanReadingLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const { ready, isPlaying, toggle, play } = usePlanAudioPlayer(audioUrl);

  const lineCount = content.split('\n').length;
  const showReadFull = !expanded && lineCount > PREVIEW_LINE_LIMIT;
  const displayContent =
    showReadFull
      ? content.split('\n').slice(0, PREVIEW_LINE_LIMIT).join('\n')
      : content;

  useEffect(() => {
    if (autoPlay && ready) play();
  }, [autoPlay, ready, play]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F8F4' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: insets.top + 4,
          paddingHorizontal: 8,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#e8e8e4',
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => setFontSize((s) => Math.min(24, s + 2))}
          onLongPress={() => setFontSize((s) => Math.max(12, s - 2))}
          style={{ padding: 8, opacity: 0.5 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>Aa</Text>
        </Pressable>
        <Pressable disabled style={{ padding: 8, opacity: 0.35 }}>
          <Ionicons name="search" size={20} color="#000" />
        </Pressable>
        <Pressable disabled style={{ padding: 8, opacity: 0.35 }}>
          <Ionicons name="globe-outline" size={20} color="#000" />
        </Pressable>
        {headerExtra}
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: ready ? 120 : 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        <MarkdownText
          content={displayContent}
          style={{
            fontSize,
            lineHeight: fontSize * 1.6,
            color: '#000',
            fontFamily: 'Georgia',
          }}
        />

        {showReadFull ? (
          <Pressable
            onPress={() => setExpanded(true)}
            style={{
              marginTop: 20,
              backgroundColor: '#e8e8e4',
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold', color: '#000' }}>
              {t('reader.read_full_text')}
            </Text>
          </Pressable>
        ) : null}

        {footerMeta}

        {ready ? (
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <Pressable
              onPress={toggle}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                borderWidth: 1,
                borderColor: '#000',
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={24}
                color="#000"
                style={!isPlaying ? { marginLeft: 3 } : undefined}
              />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <View style={{ paddingBottom: insets.bottom }}>
        <PlanNavigator
          title={sectionTitle}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={onPrev}
          onNext={onNext}
          onFinish={onFinish}
        />
      </View>
    </View>
  );
}
