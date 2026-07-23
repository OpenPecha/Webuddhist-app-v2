import { AppBottomSheet, bottomSheetContentPaddingBottom } from '@/components/settings/AppBottomSheet';
import { getLanguageLabel, supportedLanguages } from '@/constants/app-config';
import { Check } from '@/constants/settings-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { changeAppLanguage } from '@/lib/i18n';
import { StorageKeys, setString } from '@/lib/storage';
import { Text } from '@/components/ui/text';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LanguagePickerSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguagePickerSheet({ visible, onClose }: LanguagePickerSheetProps) {
  const { i18n, t } = useTranslation();
  const { foreground, brand } = useThemeColors();
  const insets = useSafeAreaInsets();
  const contentPaddingBottom = bottomSheetContentPaddingBottom('tab', insets);
  const currentCode = i18n.language.split('-')[0];

  const selectLanguage = async (code: string) => {
    await changeAppLanguage(code);
    await setString(StorageKeys.preferredLanguage, code);
    onClose();
  };

  return (
    <AppBottomSheet visible={visible} onClose={onClose} scrollable placement="tab">
      <BottomSheetScrollView contentContainerStyle={{ paddingBottom: contentPaddingBottom }}>
        <Text className="px-5 pb-2 text-lg font-bold">{t('settings.language')}</Text>
        {supportedLanguages.map((code) => {
          const selected = currentCode === code;
          const labelColor = selected ? brand : foreground;
          return (
            <Pressable
              key={code}
              onPress={() => selectLanguage(code)}
              className="flex-row items-center px-5 py-4 active:opacity-70"
            >
              <Text
                className="flex-1 text-base"
                style={{
                  color: labelColor,
                  fontWeight: selected ? '700' : '500',
                }}
              >
                {getLanguageLabel(code)}
              </Text>
              {selected ? <Check size={18} color={brand} weight="bold" /> : null}
            </Pressable>
          );
        })}
      </BottomSheetScrollView>
    </AppBottomSheet>
  );
}

export function currentLanguageLabel(code: string): string {
  return getLanguageLabel(code.split('-')[0]);
}
