import type { ReactNode } from 'react';
import Constants from 'expo-constants';
import { useEffect, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { Text } from '@/components/ui/text';
import { Linking, Modal, Platform, Pressable, View } from 'react-native';

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
  const { t } = useTranslate();
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
        <View className="flex-1 items-center justify-center bg-black/55 p-6">
          <View className="w-full max-w-[340px] gap-3 rounded-2xl bg-white p-6">
            <Text className="text-center text-xl font-bold text-foreground">
              {t('force_update_title')}
            </Text>
            <Text className="text-center text-[15px] leading-[22px] text-[#454545]">
              {t('force_update_message')}
            </Text>
            <Pressable
              onPress={openStore}
              className="mt-2 rounded-xl bg-[#0C53C5] py-3.5 active:opacity-90"
            >
              <Text className="text-center text-base font-bold text-white">
                {t('force_update_button')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
