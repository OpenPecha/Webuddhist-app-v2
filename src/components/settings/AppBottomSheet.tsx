import { TAB_BAR_CONTENT_HEIGHT } from '@/components/navigation/AppBottomTabBar';
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

/** Padding inside sheet content — tab screens already offset via bottomInset. */
export function bottomSheetContentPaddingBottom(
  placement: AppBottomSheetPlacement,
  insets: { bottom: number },
): number {
  if (placement === 'tab') {
    return MIN_CONTENT_BOTTOM_PADDING;
  }
  return Math.max(MIN_CONTENT_BOTTOM_PADDING, insets.bottom);
}

export function appBottomSheetInsets(
  placement: AppBottomSheetPlacement,
  insets: { top: number; bottom: number },
  screenHeight?: number,
  maxHeight: number | `${number}%` = '70%',
) {
  const bottomInset =
    placement === 'tab' ? TAB_BAR_CONTENT_HEIGHT + insets.bottom : 0;
  const contentPaddingBottom = bottomSheetContentPaddingBottom(placement, insets);
  const topInset = insets.top;
  const availableHeight =
    screenHeight != null
      ? Math.max(0, screenHeight - topInset - bottomInset)
      : undefined;
  const maxDynamicContentSize =
    availableHeight != null ? parseMaxHeight(maxHeight, availableHeight) : undefined;
  return {
    bottomInset,
    contentPaddingBottom,
    topInset,
    availableHeight,
    maxDynamicContentSize,
  };
}

/** Spacer for fullscreen sheets — gorhom dynamic sizing ignores paddingBottom (see gorhom#1573). */
function BottomSheetSafeAreaFooter({ placement }: { placement: AppBottomSheetPlacement }) {
  const insets = useSafeAreaInsets();
  if (placement === 'tab') return null;
  const height = bottomSheetContentPaddingBottom(placement, insets);
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
   * `tab` — sheet stops above the visible tab bar (`TAB_BAR_CONTENT_HEIGHT` + safe area).
   * `fullscreen` — anchors to the screen bottom; safe area is handled inside sheet content.
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
  const presentationIdRef = useRef(0);
  const dismissingPresentationIdRef = useRef<number | null>(null);

  const { bottomInset, topInset, maxDynamicContentSize } = useMemo(
    () => appBottomSheetInsets(placement, insets, screenHeight, maxHeight),
    [placement, insets, screenHeight, maxHeight],
  );

  useEffect(() => {
    if (visible) {
      presentationIdRef.current += 1;
      wasVisibleRef.current = true;
      requestAnimationFrame(() => {
        ref.current?.present();
      });
      return;
    }

    if (wasVisibleRef.current) {
      dismissingPresentationIdRef.current = presentationIdRef.current;
      wasVisibleRef.current = false;
      ref.current?.dismiss();
    }
  }, [visible]);

  const handleDismiss = useCallback(() => {
    wasVisibleRef.current = false;
    const dismissingId = dismissingPresentationIdRef.current;
    dismissingPresentationIdRef.current = null;
    if (dismissingId === null || dismissingId === presentationIdRef.current) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        style={[props.style, bottomInset > 0 ? { bottom: bottomInset } : undefined]}
      />
    ),
    [bottomInset],
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
          <BottomSheetSafeAreaFooter placement={placement} />
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
}
