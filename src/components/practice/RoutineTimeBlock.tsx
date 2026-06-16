import {
  RoutineItemCard,
  routineItemCoverUri,
} from '@/components/practice/RoutineItemCard';
import type { RoutineItem } from '@/types/routine';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, Text, View } from 'react-native';

interface RoutineTimeBlockProps {
  formattedTime: string;
  notificationEnabled: boolean;
  items: RoutineItem[];
  onTimePress: () => void;
  onNotificationToggle: () => void;
  onDeleteBlock: () => void;
  onAddSession: () => void;
  onDeleteItem: (index: number) => void;
}

const pillBg = '#f0f0ec';

function TimeSelector({
  formattedTime,
  onPress,
}: {
  formattedTime: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: pillBg,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'Inter-SemiBold', color: '#000' }}>
        {formattedTime}
      </Text>
      <Ionicons name="chevron-down" size={18} color="#8a8a8a" style={{ marginLeft: 12 }} />
    </Pressable>
  );
}

function NotificationToggle({
  enabled,
  onPress,
}: {
  enabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: pillBg,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      <Ionicons
        name={enabled ? 'notifications-outline' : 'notifications-off-outline'}
        size={20}
        color="#000"
      />
    </Pressable>
  );
}

/** Matches Flutter RoutineTimeBlock widget. */
export function RoutineTimeBlock({
  formattedTime,
  notificationEnabled,
  items,
  onTimePress,
  onNotificationToggle,
  onDeleteBlock,
  onAddSession,
  onDeleteItem,
}: RoutineTimeBlockProps) {
  const { t } = useTranslation();

  const confirmDeleteBlock = () => {
    Alert.alert(
      t('editRoutine.delete_block_title'),
      t('editRoutine.delete_block_message'),
      [
        { text: t('editRoutine.cancel'), style: 'cancel' },
        {
          text: t('editRoutine.delete_block_confirm'),
          style: 'destructive',
          onPress: onDeleteBlock,
        },
      ],
    );
  };

  const confirmDeleteItem = (index: number) => {
    const item = items[index];
    Alert.alert(
      t('editRoutine.remove_item_title'),
      t('editRoutine.remove_item_message', { itemName: item.title }),
      [
        { text: t('editRoutine.cancel'), style: 'cancel' },
        {
          text: t('editRoutine.remove'),
          style: 'destructive',
          onPress: () => onDeleteItem(index),
        },
      ],
    );
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TimeSelector formattedTime={formattedTime} onPress={onTimePress} />
        <View style={{ width: 4 }} />
        <NotificationToggle enabled={notificationEnabled} onPress={onNotificationToggle} />
        <View style={{ flex: 1 }} />
        <Pressable onPress={confirmDeleteBlock} hitSlop={8}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#f87171' }}>
            {t('editRoutine.delete_time_block')}
          </Text>
        </Pressable>
      </View>

      {items.length > 0 ? (
        <View style={{ marginTop: 8 }}>
          {items.map((item, index) => (
            <View key={`${item.type}-${item.id}`}>
              <RoutineItemCard
                title={item.title}
                coverUri={
                  item.type === 'plan'
                    ? routineItemCoverUri(item.coverImage, item.imageUrl)
                    : undefined
                }
                type={item.type}
                onDelete={() => confirmDeleteItem(index)}
                showReorderHandle
              />
              <View style={{ height: 1, backgroundColor: '#e8e8e4', marginLeft: 140 }} />
            </View>
          ))}
        </View>
      ) : null}

      <Pressable
        onPress={onAddSession}
        style={{ marginTop: 12, paddingLeft: 54, flexDirection: 'row', alignItems: 'center' }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            backgroundColor: pillBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={24} color="#000" />
        </View>
        <Text
          style={{
            flex: 1,
            marginLeft: 16,
            fontSize: 16,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: '#000',
          }}
        >
          {t('editRoutine.add_session')}
        </Text>
      </Pressable>
    </View>
  );
}

function AddBlockButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <Pressable onPress={onPress} style={{ alignSelf: 'flex-start' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: pillBg,
          borderRadius: 20,
        }}
      >
        <Ionicons name="add" size={16} color="#000" />
        <Text
          style={{
            marginLeft: 6,
            fontSize: 14,
            fontWeight: '600',
            fontFamily: 'Inter-SemiBold',
            color: '#000',
          }}
        >
          {t('editRoutine.add_block_label')}
        </Text>
      </View>
    </Pressable>
  );
}

export { AddBlockButton };
