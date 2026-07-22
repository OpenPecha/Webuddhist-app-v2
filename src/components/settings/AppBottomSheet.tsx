import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/utils/cn';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Platform, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type AppBottomSheetPlacement = 'tab' | 'fullscreen';

/** Minimum scroll/content padding when the OS reports no bottom inset (common on Android 3-button nav). */
const MIN_CONTENT_BOTTOM_PADDING = 16;

function parseMaxHeight(maxHeight: number | `${number}%`, heightBasis: number): number {
  if (typeof maxHeight === 'number') return maxHeight;
  const pct = Number(String(maxHeight).replace('%', ''));
  return Math.round(heightBasis * (pct / 100));
}

/** Padding for sheet content — keeps items above the home indicator / gesture bar on both platforms. */
export function bottomSheetContentPaddingBottom(insets: { bottom: number }): number {
  return Math.max(MIN_CONTENT_BOTTOM_PADDING, insets.bottom);
}

export function appBottomSheetInsets(
  _placement: AppBottomSheetPlacement,
  insets: { top: number; bottom: number },
  screenHeight?: number,
  maxHeight: number | `${number}%` = '70%',
) {
  const contentPaddingBottom = bottomSheetContentPaddingBottom(insets);
  const topInset = insets.top;
  const availableHeight =
    screenHeight != null ? Math.max(0, screenHeight - topInset) : undefined;
  const maxDynamicContentSize =
    availableHeight != null ? parseMaxHeight(maxHeight, availableHeight) : undefined;
  return {
    bottomInset: 0,
    contentPaddingBottom,
    topInset,
    availableHeight,
    maxDynamicContentSize,
  };
}

/** Spacer view — more reliable than paddingBottom with gorhom dynamic sizing (see gorhom#1573). */
function BottomSheetSafeAreaFooter() {
  const insets = useSafeAreaInsets();
  const height = bottomSheetContentPaddingBottom(insets);
  return <View style={{ height }} />;
}

interface AppBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sheetClassName?: string;
  sheetStyle?: ViewStyle;
  maxHeight?: number | `${number}%`;
  showHandle?: boolean;
  /** When true, children are rendered directly (use BottomSheetScrollView inside). */
  scrollable?: boolean;
  /**
   * `tab` — opened from a tab screen. `fullscreen` — root stack routes (default).
   * Bottom anchoring is the same on iOS and Android; safe area is handled inside sheet content.
   */
  placement?: AppBottomSheetPlacement;
}

/** Flutter-style bottom drawer: content-sized, capped below top safe area. */
export function AppBottomSheet({
  visible,
  onClose,
  children,
  sheetClassName,
  sheetStyle,
  maxHeight = '70%',
  showHandle = true,
  scrollable = false,
  placement = 'fullscreen',
}: AppBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { mutedForeground } = useThemeColors();
  const ref = useRef<BottomSheetModal>(null);
  const wasVisibleRef = useRef(false);

  const { bottomInset, topInset, maxDynamicContentSize } = useMemo(
    () => appBottomSheetInsets(placement, insets, screenHeight, maxHeight),
    [placement, insets, screenHeight, maxHeight],
  );

  useEffect(() => {
    if (visible) {
      wasVisibleRef.current = true;
      requestAnimationFrame(() => {
        ref.current?.present();
      });
      return;
    }

    if (wasVisibleRef.current) {
      wasVisibleRef.current = false;
      ref.current?.dismiss();
    }
  }, [visible]);

  const handleDismiss = useCallback(() => {
    wasVisibleRef.current = false;
    onClose();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" />
    ),
    [],
  );

  const backgroundStyle = useMemo(
    () => ({
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      ...sheetStyle,
    }),
    [sheetStyle],
  );

  return (
    <BottomSheetModal
      ref={ref}
      topInset={topInset}
      bottomInset={bottomInset}
      enableDynamicSizing
      maxDynamicContentSize={maxDynamicContentSize}
      enableContentPanningGesture={scrollable}
      enableOverDrag={false}
      enablePanDownToClose
      enableDismissOnClose
      stackBehavior="push"
      keyboardBehavior={Platform.OS === 'android' ? 'extend' : 'interactive'}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={
        showHandle
          ? {
            width: 40,
            height: 4,
            backgroundColor: mutedForeground,
            opacity: 0.35,
          }
          : undefined
      }
      handleComponent={showHandle ? undefined : null}
      backgroundStyle={backgroundStyle}
    >
      {scrollable ? (
        children
      ) : (
        <BottomSheetView className={cn('bg-background', sheetClassName)} style={{ flexGrow: 0 }}>
          {children}
          <BottomSheetSafeAreaFooter />
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
}
