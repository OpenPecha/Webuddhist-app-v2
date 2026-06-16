import '@/lib/i18n';
import { AddBlockButton, RoutineTimeBlock } from '@/components/practice/RoutineTimeBlock';
import { TimePickerSheet } from '@/components/practice/TimePickerSheet';
import { useRoutine } from '@/hooks/api/useRoutine';
import { useRoutineMutations } from '@/hooks/api/useRoutineMutations';
import { takePendingRoutineItem } from '@/stores/edit-routine-selection';
import {
  blockToTimeBlockRequest,
  createEmptyBlock,
  defaultBlockTimeInt,
  type EditableRoutineBlock,
} from '@/utils/routine-edit';
import { formatRoutineTimeFromInt } from '@/utils/routine-time';
import {
  adjustTimeForMinimumGap,
  canAddBlock,
  MAX_ROUTINE_BLOCKS,
  MIN_BLOCK_GAP_MINUTES,
  sortBlocksByTime,
} from '@/utils/routine-time-utils';
import { type Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function hydrateBlocksFromRoutine(
  routine: NonNullable<ReturnType<typeof useRoutine>['data']>,
): EditableRoutineBlock[] {
  if (!routine.blocks.length) return [createEmptyBlock()];
  return sortBlocksByTime(
    routine.blocks.map((block) => ({
      localId: `block-${block.id}`,
      apiTimeBlockId: block.id,
      timeInt: block.timeInt,
      formattedTime: block.formattedTime,
      notificationEnabled: block.notificationEnabled,
      items: [...block.items],
    })),
  );
}

export default function EditRoutineScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data: routine, isLoading } = useRoutine();
  const { createRoutine, addTimeBlock, saveTimeBlock, removeTimeBlock } = useRoutineMutations();

  const [blocks, setBlocks] = useState<EditableRoutineBlock[]>([createEmptyBlock()]);
  const [apiRoutineId, setApiRoutineId] = useState<string | undefined>();
  const [removedBlockIds, setRemovedBlockIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const editingBlock = useMemo(
    () => blocks.find((b) => b.localId === editingBlockId),
    [blocks, editingBlockId],
  );

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (hydrated || isLoading) return;
    if (routine) {
      setApiRoutineId(routine.apiRoutineId);
      setBlocks(hydrateBlocksFromRoutine(routine));
    } else {
      setBlocks([createEmptyBlock()]);
    }
    setHydrated(true);
  }, [hydrated, isLoading, routine]);

  useFocusEffect(
    useCallback(() => {
      setBlocks((prev) =>
        sortBlocksByTime(
          prev.map((block) => {
            const pending = takePendingRoutineItem(block.localId);
            if (!pending) return block;
            const exists = block.items.some(
              (i) => i.id === pending.id && i.type === pending.type,
            );
            if (exists) {
              Alert.alert(t('editRoutine.duplicate_item'), '');
              return block;
            }
            return { ...block, items: [...block.items, pending] };
          }),
        ),
      );
    }, [t]),
  );

  const isLastBlockEmpty = blocks.length > 0 && blocks[blocks.length - 1].items.length === 0;
  const shouldShowAddButton = !isLastBlockEmpty && canAddBlock(blocks.length);
  const emptyBlockCount = blocks.filter((b) => b.items.length === 0).length;

  const updateBlock = (localId: string, patch: Partial<EditableRoutineBlock>) => {
    setBlocks((prev) =>
      sortBlocksByTime(prev.map((b) => (b.localId === localId ? { ...b, ...patch } : b))),
    );
  };

  const removeBlock = (localId: string) => {
    setBlocks((prev) => {
      const target = prev.find((b) => b.localId === localId);
      if (target?.apiTimeBlockId) {
        setRemovedBlockIds((ids) => [...ids, target.apiTimeBlockId!]);
      }
      const next = prev.filter((b) => b.localId !== localId);
      return next.length ? next : [createEmptyBlock()];
    });
  };

  const removeItemAt = (blockLocalId: string, itemIndex: number) => {
    setBlocks((prev) => {
      const next = prev.map((b) => {
        if (b.localId !== blockLocalId) return b;
        const items = b.items.filter((_, i) => i !== itemIndex);
        return { ...b, items };
      });
      const filtered = next.filter((b) => b.items.length > 0);
      return filtered.length ? filtered : [createEmptyBlock()];
    });
  };

  const addBlock = () => {
    if (!canAddBlock(blocks.length)) {
      Alert.alert(t('editRoutine.max_blocks', { max: MAX_ROUTINE_BLOCKS }));
      return;
    }
    const otherTimes = blocks.map((b) => b.timeInt);
    const adjusted = adjustTimeForMinimumGap(defaultBlockTimeInt(), otherTimes);
    if (adjusted == null) {
      Alert.alert(t('editRoutine.no_time_slot'));
      return;
    }
    setBlocks((prev) =>
      sortBlocksByTime([...prev, { ...createEmptyBlock(adjusted), formattedTime: formatRoutineTimeFromInt(adjusted) }]),
    );
  };

  const pickTime = (blockLocalId: string) => {
    setEditingBlockId(blockLocalId);
  };

  const onTimeConfirmed = (blockLocalId: string, pickedTimeInt: number) => {
    const otherTimes = blocks
      .filter((b) => b.localId !== blockLocalId)
      .map((b) => b.timeInt);
    const adjusted = adjustTimeForMinimumGap(pickedTimeInt, otherTimes);
    if (adjusted == null) {
      Alert.alert(t('editRoutine.no_time_slot'));
      return;
    }
    if (adjusted !== pickedTimeInt) {
      Alert.alert(
        t('editRoutine.time_adjusted_title'),
        t('editRoutine.time_adjusted_message', {
          time: formatRoutineTimeFromInt(adjusted),
          minutes: MIN_BLOCK_GAP_MINUTES,
        }),
      );
    }
    updateBlock(blockLocalId, {
      timeInt: adjusted,
      formattedTime: formatRoutineTimeFromInt(adjusted),
    });
  };

  const handleSave = async () => {
    if (emptyBlockCount > 0) {
      const hasMultiple = emptyBlockCount > 1;
      const confirmed = await new Promise<boolean>((resolve) => {
        Alert.alert(
          hasMultiple
            ? t('editRoutine.empty_block_title_plural', { count: emptyBlockCount })
            : t('editRoutine.empty_block_title'),
          hasMultiple
            ? t('editRoutine.empty_block_message_plural', { count: emptyBlockCount })
            : t('editRoutine.empty_block_message'),
          [
            { text: t('editRoutine.empty_block_add_items'), onPress: () => resolve(false) },
            {
              text: hasMultiple
                ? t('editRoutine.empty_block_delete_plural')
                : t('editRoutine.empty_block_delete'),
              style: 'destructive',
              onPress: () => resolve(true),
            },
          ],
        );
      });
      if (!confirmed) return;
    }

    const toSave = blocks.filter((b) => b.items.length > 0);
    if (!toSave.length) {
      Alert.alert(t('editRoutine.empty_block_title'), t('editRoutine.no_plans'));
      return;
    }

    setSaving(true);
    try {
      let routineId = apiRoutineId;

      for (const removedId of removedBlockIds) {
        if (routineId) {
          await removeTimeBlock.mutateAsync({ routineId, blockId: removedId });
        }
      }

      if (!routineId) {
        const created = await createRoutine.mutateAsync(blockToTimeBlockRequest(toSave[0]));
        routineId = created.id;
        for (let i = 1; i < toSave.length; i++) {
          await addTimeBlock.mutateAsync({
            routineId,
            request: blockToTimeBlockRequest(toSave[i]),
          });
        }
      } else {
        for (const block of toSave) {
          const request = blockToTimeBlockRequest(block);
          if (block.apiTimeBlockId) {
            await saveTimeBlock.mutateAsync({
              routineId,
              blockId: block.apiTimeBlockId,
              request,
            });
          } else {
            await addTimeBlock.mutateAsync({ routineId, request });
          }
        }
      }

      router.back();
    } catch (e) {
      const message = e instanceof Error ? e.message : t('practice.routine_load_error');
      Alert.alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !hydrated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FDFDFC',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top,
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
          {t('editRoutine.title')}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFC', paddingTop: insets.top }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ height: 16 }} />
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={{ alignSelf: 'flex-end', opacity: saving ? 0.5 : 1 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '500', fontFamily: 'Inter-Regular', color: '#000' }}>
            {saving ? t('editRoutine.saving') : t('editRoutine.done')}
          </Text>
        </Pressable>
        <View style={{ height: 8 }} />
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            fontFamily: 'Inter-Bold',
            color: '#000',
          }}
        >
          {t('editRoutine.title')}
        </Text>
        <View style={{ height: 12 }} />
        <View style={{ height: 1, backgroundColor: '#e8e8e4' }} />
        <View style={{ height: 14 }} />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {blocks.map((block, index) => (
            <View key={block.localId}>
              <RoutineTimeBlock
                formattedTime={block.formattedTime}
                notificationEnabled={block.notificationEnabled}
                items={block.items}
                onTimePress={() => pickTime(block.localId)}
                onNotificationToggle={() =>
                  updateBlock(block.localId, {
                    notificationEnabled: !block.notificationEnabled,
                  })
                }
                onDeleteBlock={() => removeBlock(block.localId)}
                onAddSession={() =>
                  router.push({
                    pathname: '/practice/edit-routine/select-session',
                    params: { blockLocalId: block.localId },
                  } as Href)
                }
                onDeleteItem={(itemIndex) => removeItemAt(block.localId, itemIndex)}
              />
              {index < blocks.length - 1 || shouldShowAddButton ? (
                <View style={{ paddingVertical: 16 }}>
                  <View style={{ height: 1, backgroundColor: '#e8e8e4' }} />
                </View>
              ) : null}
            </View>
          ))}
          {shouldShowAddButton ? <AddBlockButton onPress={addBlock} /> : null}
        </ScrollView>
      </View>

      <TimePickerSheet
        visible={!!editingBlock}
        timeInt={editingBlock?.timeInt ?? 0}
        onClose={() => setEditingBlockId(null)}
        onConfirm={(next) => {
          if (editingBlockId) onTimeConfirmed(editingBlockId, next);
        }}
      />
    </View>
  );
}
