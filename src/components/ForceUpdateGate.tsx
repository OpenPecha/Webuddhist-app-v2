import type { ReactNode } from 'react';
import Constants from 'expo-constants';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { Linking, Modal, Platform, Pressable, View } from 'react-native';
import { AppColors } from '@/constants/app-colors';

const IOS_STORE_URL =
  process.env.EXPO_PUBLIC_IOS_STORE_URL ??
  'https://apps.apple.com/app/webuddhist/id000000000';
const ANDROID_STORE_URL =
  process.env.EXPO_PUBLIC_ANDROID_STORE_URL ??
  'https://play.google.com/store/apps/details?id=org.pecha.app';

function parseVersion(version: string): number[] {
  return version.split('.').map((part) => parseInt(part, 10) || 0);
}

function isVersionLessThan(current: string, minimum: string): boolean {
  const a = parseVersion(current);
  const b = parseVersion(minimum);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av < bv) return true;
    if (av > bv) return false;
  }
  return false;
}

function getCurrentAppVersion(): string {
  return Constants.expoConfig?.version ?? '0.0.0';
}

function getMinimumRequiredVersion(): string | null {
  return process.env.EXPO_PUBLIC_MIN_APP_VERSION ?? null;
}

interface ForceUpdateGateProps {
  children: ReactNode;
}

export function ForceUpdateGate({ children }: ForceUpdateGateProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const updateRequired = useMemo(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;
    const minVersion = getMinimumRequiredVersion();
    if (!minVersion) return false;
    return isVersionLessThan(getCurrentAppVersion(), minVersion);
  }, []);

  useEffect(() => {
    if (updateRequired) setVisible(true);
  }, [updateRequired]);

  const openStore = () => {
    const url = Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL;
    void Linking.openURL(url);
  };

  return (
    <>
      {children}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.55)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 340,
              borderRadius: 16,
              backgroundColor: '#fff',
              padding: 24,
              gap: 12,
            }}
          >
            <Text className="text-center text-xl font-bold text-foreground">
              {t('force_update.title')}
            </Text>
            <Text className="text-center text-[15px] leading-[22px] text-[#454545]">
              {t('force_update.message')}
            </Text>
            <Pressable
              onPress={openStore}
              style={({ pressed }) => ({
                marginTop: 8,
                borderRadius: 12,
                backgroundColor: AppColors.blue,
                paddingVertical: 14,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text className="text-center text-base font-bold text-white">
                {t('force_update.button')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
