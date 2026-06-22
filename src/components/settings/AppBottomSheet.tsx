import { useThemeColors } from '@/hooks/useThemeColors';
import { cn } from '@/utils/cn';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useWindowDimensions, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
}

function parseMaxHeight(maxHeight: number | `${number}%`, screenHeight: number): number {
  if (typeof maxHeight === 'number') return maxHeight;
  const pct = Number(String(maxHeight).replace('%', ''));
  return Math.round(screenHeight * (pct / 100));
}

/** Flutter-style bottom drawer with bidirectional drag dismiss. */
export function AppBottomSheet({
  visible,
  onClose,
  children,
  sheetClassName,
  sheetStyle,
  maxHeight = '70%',
  showHandle = true,
  scrollable = false,
}: AppBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { mutedForeground } = useThemeColors();
  const ref = useRef<BottomSheetModal>(null);
  const wasVisibleRef = useRef(false);

  const snapPoints = useMemo(
    () => [parseMaxHeight(maxHeight, screenHeight)],
    [maxHeight, screenHeight],
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
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDismissOnClose
      stackBehavior="push"
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      bottomInset={insets.bottom}
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
        <BottomSheetView
          className={cn('bg-background', sheetClassName)}
          style={{ paddingBottom: 8 }}
        >
          {children}
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
}
