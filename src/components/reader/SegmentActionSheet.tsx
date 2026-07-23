import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { Text } from '@/components/ui/text';
import { SegmentCommentaryPanel } from '@/components/reader/SegmentCommentaryPanel';
import { SegmentTranslationPanel } from '@/components/reader/SegmentTranslationPanel';
import { useIsBookmarked } from '@/hooks/api/useBookmarkExists';
import { useToggleBookmark } from '@/hooks/api/useToggleBookmark';
import { useSegmentInfo } from '@/hooks/api/useSegmentInfo';
import { useContentLanguage } from '@/hooks/useContentLanguage';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import type { SelectedSegment } from '@/hooks/useReaderSegmentSelection';
import { buildReaderSegmentShareUrl } from '@/utils/reader-deep-link';
import { segmentPlainText } from '@/utils/segment-plain-text';
import { copyToClipboard } from '@/utils/copy-to-clipboard';
import { hapticLight, hapticSelection } from '@/utils/haptics';
import { showAppToast } from '@/utils/show-app-toast';
import { useGuest } from '@/providers/guest';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  View,
} from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import type { SegmentInfo, SegmentVideo } from '@/types/segment-info';

type SheetView = 'actions' | 'commentaries' | 'versions';

interface SegmentActionSheetProps {
  selected: SelectedSegment | null;
  onClose: () => void;
}

function ActionButton({
  label,
  icon,
  onPress,
  loading,
  active,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  loading?: boolean;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!loading, selected: !!active }}
      className="w-[78px] items-center"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#000" style={{ height: 28 }} />
      ) : (
        <View className="h-7 justify-center">
          <Ionicons name={icon} size={24} color={active ? '#0066cc' : '#000'} />
        </View>
      )}
      <Text
        className={`text-xs font-semibold mt-1 ${active ? 'text-[#0066cc]' : 'text-foreground'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ResourceTile({
  label,
  icon,
  count,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  count?: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={count === undefined ? label : `${label}, ${count}`}
      className="flex-row items-center py-3 border-b border-[#f0f0ec]"
    >
      <Ionicons name={icon} size={20} color="#000" style={{ marginRight: 12 }} />
      <Text className="flex-1 text-[15px] text-foreground">{label}</Text>
      <View className="min-w-7 px-2 py-0.5 rounded-xl bg-[#f0f0ec] items-center mr-2">
        <Text className="text-[13px] font-semibold text-foreground">
          {count === undefined ? '—' : count}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#8a8a8a" />
    </Pressable>
  );
}

function SheetHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <View className="flex-row items-center mb-3 min-h-8">
      {onBack ? (
        <Pressable onPress={onBack} className="p-1 mr-2">
          <Ionicons name="chevron-back" size={22} color="#000" />
        </Pressable>
      ) : null}
      <Text className="text-base font-bold text-foreground">{title}</Text>
    </View>
  );
}

function ActionsBody({
  onCopy,
  onShare,
  onBookmark,
  bookmarkPending,
  isBookmarked,
  infoLoading,
  infoError,
  info,
  videos,
  onOpenCommentaries,
  onOpenVersions,
}: {
  onCopy: () => void;
  onShare: () => void;
  onBookmark: () => void;
  bookmarkPending: boolean;
  isBookmarked: boolean;
  infoLoading: boolean;
  infoError: boolean;
  info?: SegmentInfo;
  videos: SegmentVideo[];
  onOpenCommentaries: () => void;
  onOpenVersions: () => void;
}) {
  const countUnavailable = infoLoading || infoError;

  return (
    <>
      <View className="flex-row justify-center gap-4 mt-2">
        <ActionButton label={"Copy"} icon="copy-outline" onPress={onCopy} />
        <ActionButton label={"Share"} icon="share-outline" onPress={onShare} />
        <ActionButton
          label={isBookmarked ? "Bookmarked" : "Bookmark"}
          icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          active={isBookmarked}
          onPress={onBookmark}
          loading={bookmarkPending}
        />
      </View>

      <Text className="text-[13px] font-semibold mt-6 mb-2 text-foreground">
        {"Related resources"}
      </Text>
      <View className="h-px bg-[#e8e8e4] mb-3" />

      <ResourceTile
        label={"Commentaries"}
        icon="chatbubble-ellipses-outline"
        count={countUnavailable ? undefined : (info?.relatedText.commentaries ?? 0)}
        onPress={onOpenCommentaries}
      />
      <ResourceTile
        label={"Version"}
        icon="language-outline"
        count={countUnavailable ? undefined : (info?.translations ?? 0)}
        onPress={onOpenVersions}
      />

      {videos.length > 0 ? (
        <>
          <Text className="text-[13px] font-semibold mt-5 mb-3 text-foreground">
            {"Videos"}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {videos.map((video) => (
              <Pressable
                key={video.id}
                onPress={() => {
                  void WebBrowser.openBrowserAsync(video.url, {
                    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
                  });
                }}
                className="w-40 mr-3"
              >
                {video.thumbnailUrl ? (
                  <Image
                    source={{ uri: video.thumbnailUrl }}
                    style={{ width: 160, height: 90, borderRadius: 8, backgroundColor: '#000' }}
                    contentFit="cover"
                  />
                ) : (
                  <View className="w-40 h-[90px] rounded-lg bg-black" />
                )}
                <Text numberOfLines={2} className="text-xs mt-1.5 text-[#333]">
                  {video.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}
    </>
  );
}

export function SegmentActionSheet({ selected, onClose }: SegmentActionSheetProps) {
  const language = useContentLanguage();
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const [view, setView] = useState<SheetView>('actions');

  const { data: info, isLoading: infoLoading, isError: infoError } = useSegmentInfo(
    selected?.segmentId ?? null,
    !!selected,
  );
  const { isBookmarked } = useIsBookmarked(
    selected?.segmentId ?? '',
    'VERSE',
    !!selected && !isGuest,
  );
  const toggleBookmark = useToggleBookmark();

  useEffect(() => {
    setView('actions');
  }, [selected?.segmentId]);

  if (!selected) return null;

  const handleCopy = async () => {
    hapticLight();
    const text = segmentPlainText(selected.content);
    const result = await copyToClipboard(text);
    if (result.ok) {
      showAppToast("Copied to clipboard");
      onClose();
    } else if (result.cancelled) {
      onClose();
    } else {
      showAppToast("Could not copy");
    }
  };

  const handleShare = async () => {
    hapticLight();
    try {
      const url = buildReaderSegmentShareUrl(selected.textId, selected.segmentId, language);
      await Share.share({ message: url });
      onClose();
    } catch {
      showAppToast("Could not share");
    }
  };

  const handleBookmark = () => {
    hapticLight();
    if (isGuest || !user) {
      showLoginDrawer();
      return;
    }
    toggleBookmark.mutate({ type: 'VERSE', sourceId: selected.segmentId });
  };

  const openCommentaries = () => {
    hapticSelection();
    setView('commentaries');
  };

  const openVersions = () => {
    hapticSelection();
    setView('versions');
  };

  const videos = info?.videos ?? [];
  const sheetTitle =
    view === 'commentaries'
      ? "Commentaries"
      : view === 'versions'
        ? "Translations"
        : '';

  const maxHeight =
    view === 'actions'
      ? videos.length > 0
        ? '85%'
        : '50%'
      : '75%';

  const body =
    view === 'actions' ? (
      <ActionsBody
        onCopy={() => void handleCopy()}
        onShare={() => void handleShare()}
        onBookmark={handleBookmark}
        bookmarkPending={toggleBookmark.isPending}
        isBookmarked={isBookmarked}
        infoLoading={infoLoading}
        infoError={infoError}
        info={info}
        videos={videos}
        onOpenCommentaries={openCommentaries}
        onOpenVersions={openVersions}
      />
    ) : view === 'commentaries' ? (
      <SegmentCommentaryPanel segmentId={selected.segmentId} />
    ) : (
      <SegmentTranslationPanel segmentId={selected.segmentId} />
    );

  const handleClose = () => {
    if (view !== 'actions') {
      setView('actions');
      return;
    }
    onClose();
  };

  return (
    <>
      <AppBottomSheet
        visible
        onClose={handleClose}
        placement="fullscreen"
        maxHeight={maxHeight}
        scrollable={view !== 'actions' || videos.length > 0}
      >
        {view !== 'actions' || videos.length > 0 ? (
          <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
            {view !== 'actions' ? (
              <SheetHeader
                title={sheetTitle}
                onBack={() => setView('actions')}
              />
            ) : null}
            {body}
          </BottomSheetScrollView>
        ) : (
          <View className="px-5 pb-6">{body}</View>
        )}
      </AppBottomSheet>
      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </>
  );
}
