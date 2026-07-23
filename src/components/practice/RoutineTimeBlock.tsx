import {
  RoutineItemCard,
  routineItemCoverUri,
} from '@/components/practice/RoutineItemCard';
import { Text } from '@/components/ui/text';
import { useDialog } from '@/hooks/useDialog';
import type { RoutineItem } from '@/types/routine';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

interface RoutineTimeBlockProps {
  formattedTime: string;
  notificationEnabled: boolean;
  items: RoutineItem[];
  onTimePress: () => void;
  onNotificationToggle: () => void;
  onDeleteBlock: () => void;
  onAddSession: () => void;
  onDeleteItem: (index: number) => void;
  onReorderItems: (items: RoutineItem[]) => void;
}


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
      className="flex-row items-center px-3 py-2 bg-[#f0f0ec] rounded-tl-[20px] rounded-bl-[20px]"
    >
      <Text className="text-sm font-semibold text-foreground">{formattedTime}</Text>
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
      className="px-3 py-2 bg-[#f0f0ec] rounded-tr-[20px] rounded-br-[20px]"
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
  onReorderItems,
}: RoutineTimeBlockProps) {
  const { dialog, confirmDestructive } = useDialog();

  const confirmDeleteBlock = async () => {
    const confirmed = await confirmDestructive({
      title: "Remove block?",
      message: "The time block and all its items will be removed",
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
    });
    if (confirmed) onDeleteBlock();
  };

  const confirmDeleteItem = async (index: number) => {
    const item = items[index];
    const confirmed = await confirmDestructive({
      title: "Remove item?",
      message: `"${item.title}" will be removed from this block`,
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
    });
    if (confirmed) onDeleteItem(index);
  };

  return (
    <View>
      <View className="flex-row items-center">
        <TimeSelector formattedTime={formattedTime} onPress={onTimePress} />
        <View className="w-1" />
        <NotificationToggle enabled={notificationEnabled} onPress={onNotificationToggle} />
        <View className="flex-1" />
        <Pressable onPress={confirmDeleteBlock} hitSlop={8}>
          <Text className="text-sm font-semibold text-[#f87171]">
            {"Remove time block"}
          </Text>
        </Pressable>
      </View>

      {items.length > 0 ? (
        <View className="mt-2">
          <DraggableFlatList
            data={items}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            scrollEnabled={false}
            activationDistance={12}
            onDragEnd={({ data }) => onReorderItems(data)}
            renderItem={({ item, drag, isActive, getIndex }) => {
              const index = getIndex();
              return (
                <ScaleDecorator activeScale={1.02}>
                  <View>
                    <RoutineItemCard
                      title={item.title}
                      coverUri={
                        item.type === 'plan'
                          ? routineItemCoverUri(item.coverImage, item.imageUrl)
                          : undefined
                      }
                      type={item.type}
                      onDelete={
                        index != null ? () => confirmDeleteItem(index) : undefined
                      }
                      onReorderDragStart={drag}
                      isDragging={isActive}
                    />
                    <View className="h-px bg-[#e8e8e4] ml-[140px]" />
                  </View>
                </ScaleDecorator>
              );
            }}
          />
        </View>
      ) : null}

      <Pressable
        onPress={onAddSession}
        className="mt-3 pl-[54px] flex-row items-center"
      >
        <View className="w-[72px] h-[72px] rounded-xl bg-[#f0f0ec] items-center justify-center">
          <Ionicons name="add" size={24} color="#000" />
        </View>
        <Text className="flex-1 ml-4 text-base font-semibold text-foreground">
          {"Add to session"}
        </Text>
      </Pressable>
      {dialog}
    </View>
  );
}

function AddBlockButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="self-start">
      <View className="flex-row items-center px-3 py-2 bg-[#f0f0ec] rounded-[20px]">
        <Ionicons name="add" size={16} color="#000" />
        <Text className="ml-1.5 text-sm font-semibold text-foreground">
          {"Time block"}
        </Text>
      </View>
    </Pressable>
  );
}

export { AddBlockButton };
