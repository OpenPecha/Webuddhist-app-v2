import { AppBottomSheet } from '@/components/settings/AppBottomSheet';
import { dateFromTimeInt, timeIntFromDate } from '@/utils/routine-time-utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, Text, View } from 'react-native';

interface TimePickerSheetProps {
  visible: boolean;
  timeInt: number;
  onClose: () => void;
  onConfirm: (timeInt: number) => void;
}

interface TimePickerSheetContentProps {
  visible: boolean;
  timeInt: number;
  onClose: () => void;
  onConfirm: (timeInt: number) => void;
}

/** iOS Cupertino wheel + Android system time picker — matches Flutter `_showCupertinoTimePicker`. */
export function TimePickerSheet({ visible, timeInt, onClose, onConfirm }: TimePickerSheetProps) {
  if (!visible) return null;

  return (
    <TimePickerSheetContent
      visible={visible}
      key={timeInt}
      timeInt={timeInt}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

function TimePickerSheetContent({
  visible,
  timeInt,
  onClose,
  onConfirm,
}: TimePickerSheetContentProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(() => dateFromTimeInt(timeInt));

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={selected}
        mode="time"
        is24Hour={false}
        onValueChange={(_, date) => {
          onClose();
          if (date) onConfirm(timeIntFromDate(date));
        }}
        onDismiss={onClose}
      />
    );
  }

  return (
    <AppBottomSheet visible={visible} onClose={onClose} maxHeight="50%">
      <View className="flex-row justify-between px-2">
        <Pressable onPress={onClose} className="p-3">
          <Text className="text-base text-muted-foreground">{t('editRoutine.cancel')}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            onConfirm(timeIntFromDate(selected));
            onClose();
          }}
          className="p-3"
        >
          <Text className="text-base font-semibold">{t('editRoutine.done')}</Text>
        </Pressable>
      </View>
      <DateTimePicker
        value={selected}
        mode="time"
        display="spinner"
        onValueChange={(_, date) => {
          if (date) setSelected(date);
        }}
        style={{ height: 216 }}
      />
    </AppBottomSheet>
  );
}
