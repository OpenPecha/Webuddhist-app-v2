import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { useGuest } from '@/providers/guest';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth0 } from 'react-native-auth0';

const logo = require('../../../assets/images/webuddhist_gold.png');
const DISMISS_DRAG_THRESHOLD = 80;
const DISMISS_VELOCITY_THRESHOLD = 0.75;
const DISMISS_TRANSLATE_TARGET = 800;

/** Stable JS entry point for dismiss animations — avoids reading refs during render. */
let loginDrawerCloseHandler: (() => void) | null = null;

interface LoginDrawerProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * In-screen bottom sheet (not a root Modal) so the tab bar stays visible,
 * matching Flutter's bottom sheet scoped to the tab body.
 */
export function LoginDrawer({ visible, onClose }: LoginDrawerProps) {
  const { isLoading, user } = useAuth0();
  const { clearGuest } = useGuest();
  const { t } = useTranslation();
  const onCloseRef = useRef(onClose);
  const translateY = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    onCloseRef.current = onClose;
    loginDrawerCloseHandler = () => onCloseRef.current();
    return () => {
      loginDrawerCloseHandler = null;
    };
  }, [onClose]);

  useEffect(() => {
    if (visible && user) {
      clearGuest().finally(() => onCloseRef.current());
    }
  }, [visible, user, clearGuest]);

  const finishDismiss = useCallback(() => {
    translateY.setValue(0);
    loginDrawerCloseHandler?.();
  }, [translateY]);

  const animateDismiss = useCallback(() => {
    Animated.timing(translateY, {
      toValue: DISMISS_TRANSLATE_TARGET,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        finishDismiss();
      }
    });
  }, [finishDismiss, translateY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          gesture.dy > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) {
            translateY.setValue(gesture.dy);
          }
        },
        onPanResponderRelease: (_, gesture) => {
          const shouldDismiss =
            gesture.dy > DISMISS_DRAG_THRESHOLD || gesture.vy > DISMISS_VELOCITY_THRESHOLD;

          if (shouldDismiss) {
            Animated.timing(translateY, {
              toValue: DISMISS_TRANSLATE_TARGET,
              duration: 220,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) {
                finishDismiss();
              }
            });
            return;
          }

          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        },
      }),
    [finishDismiss, translateY],
  );

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={animateDismiss}
            accessibilityRole="button"
            accessibilityLabel={t('auth.drawer_title')}
          />

          <Animated.View
            style={[
              styles.sheet,
              { transform: [{ translateY }] },
            ]}
          >
            <View {...panResponder.panHandlers} style={styles.handleArea}>
              <View style={styles.handle} />
            </View>

            <View style={{ alignItems: 'center', gap: 24 }}>
              <Image source={logo} style={{ width: 80, height: 80 }} contentFit="contain" />

              <View style={{ alignItems: 'center', gap: 4 }}>
                <Text style={styles.title}>{t('auth.drawer_title')}</Text>
                <Text style={styles.subtitle}>{t('auth.drawer_subtitle')}</Text>
              </View>

              {isLoading ? (
                <ActivityIndicator size="large" color="#000" style={{ marginVertical: 24 }} />
              ) : (
                <SocialLoginButtons onSuccess={onClose} className="px-0" />
              )}
            </View>
          </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#FDFDFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  handleArea: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#8a8a8a',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
});
