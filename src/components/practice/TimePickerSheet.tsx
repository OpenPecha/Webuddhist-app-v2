import { dateFromTimeInt, timeIntFromDate } from '@/utils/routine-time-utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, Text, View } from 'react-native';

interface TimePickerSheetProps {
  visible: boolean;
  timeInt: number;
  onClose: () => void;
  onConfirm: (timeInt: number) => void;
}

/** iOS Cupertino wheel + Android system time picker — matches Flutter `_showCupertinoTimePicker`. */
export function TimePickerSheet({ visible, timeInt, onClose, onConfirm }: TimePickerSheetProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(dateFromTimeInt(timeInt));

  useEffect(() => {
    if (visible) setSelected(dateFromTimeInt(timeInt));
  }, [visible, timeInt]);

  if (Platform.OS === 'android' && visible) {
    return (
      <DateTimePicker
        value={selected}
        mode="time"
        is24Hour={false}
        onChange={(_, date) => {
          onClose();
          if (date) onConfirm(timeIntFromDate(date));
        }}
      />
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={{
              backgroundColor: '#FDFDFC',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 24,
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#e8e8e4',
                marginTop: 10,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 8,
              }}
            >
              <Pressable onPress={onClose} style={{ padding: 12 }}>
                <Text style={{ fontSize: 16, color: '#8a8a8a' }}>{t('editRoutine.cancel')}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onConfirm(timeIntFromDate(selected));
                  onClose();
                }}
                style={{ padding: 12 }}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
                  {t('editRoutine.done')}
                </Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={selected}
              mode="time"
              display="spinner"
              onChange={(_, date) => {
                if (date) setSelected(date);
              }}
              style={{ height: 216 }}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
