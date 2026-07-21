import { AddBlockButton, RoutineTimeBlock } from '@/components/practice/RoutineTimeBlock';
import { TimePickerSheet } from '@/components/practice/TimePickerSheet';
import { useDialog } from '@/hooks/useDialog';
import { useRoutine } from '@/hooks/api/useRoutine';
import { useRoutineMutations } from '@/hooks/api/useRoutineMutations';
import { requestNotificationPermissions } from '@/lib/notifications';
import { takePendingRoutineItem } from '@/stores/edit-routine-selection';
import type { RoutineItem } from '@/types/routine';
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
import { type Href, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchSeriesById } from '@/services/series';
import { fetchPlanById } from '@/services/plans';
import { pickSeriesMetadata } from '@/types/series';
import { useContentLanguage } from '@/hooks/useContentLanguage';

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
  const { enrollSeriesId, initialPlanId } = useLocalSearchParams<{
    enrollSeriesId?: string;
    initialPlanId?: string;
  }>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const contentLanguage = useContentLanguage();
  const { dialog, confirmChoice } = useDialog();
  const { data: routine, isLoading } = useRoutine();
  const { createRoutine, addTimeBlock, saveTimeBlock, removeTimeBlock } = useRoutineMutations();

  const [blocks, setBlocks] = useState<EditableRoutineBlock[]>([createEmptyBlock()]);
  const [apiRoutineId, setApiRoutineId] = useState<string | undefined>();
  const [removedBlockIds, setRemovedBlockIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [allowLeave, setAllowLeave] = useState(false);
  const seriesEnrollmentHydrated = useRef(false);
  const planPrefillHydrated = useRef(false);

  const editingBlock = useMemo(
    () => blocks.find((b) => b.localId === editingBlockId),
    [blocks, editingBlockId],
  );

  useEffect(() => {
    if (!allowLeave) return;
    router.back();
  }, [allowLeave, router]);

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

  const syncBlockToServer = useCallback(
    async (block: EditableRoutineBlock, routineId: string | undefined) => {
      const request = blockToTimeBlockRequest(block);
      if (!routineId) {
        const created = await createRoutine.mutateAsync(request);
        setApiRoutineId(created.id);
        setBlocks((prev) =>
          prev.map((b) =>
            b.localId === block.localId
              ? { ...b, apiTimeBlockId: created.time_blocks[0]?.id }
              : b,
          ),
        );
        return created.id;
      }
      if (block.apiTimeBlockId) {
        await saveTimeBlock.mutateAsync({
          routineId,
          blockId: block.apiTimeBlockId,
          request,
        });
      } else {
        const created = await addTimeBlock.mutateAsync({ routineId, request });
        setBlocks((prev) =>
          prev.map((b) =>
            b.localId === block.localId ? { ...b, apiTimeBlockId: created.id } : b,
          ),
        );
      }
      return routineId;
    },
    [addTimeBlock, createRoutine, saveTimeBlock],
  );

  useEffect(() => {
    if (!hydrated || !enrollSeriesId || seriesEnrollmentHydrated.current) return;

    seriesEnrollmentHydrated.current = true;

    const hydrateSeriesEnrollment = async () => {
      try {
        const series = await fetchSeriesById(enrollSeriesId, contentLanguage);
        const meta = pickSeriesMetadata(series.metadata, contentLanguage);
        const seriesItem: RoutineItem = {
          id: series.id,
          title: meta?.title ?? '',
          coverImage: series.image,
          type: 'series',
          enrolledAt: new Date().toISOString(),
          language: meta?.language ?? contentLanguage,
        };

        let targetBlock: EditableRoutineBlock | null = null;
        let nextBlocks: EditableRoutineBlock[] = [];

        setBlocks((prev) => {
          const alreadyExists = prev.some((b) =>
            b.items.some((i) => i.id === series.id && i.type === 'series'),
          );
          if (alreadyExists) {
            nextBlocks = prev;
            return prev;
          }

          const emptyIndex = prev.findIndex((b) => b.items.length === 0);
          if (emptyIndex >= 0) {
            const next = [...prev];
            const block = {
              ...next[emptyIndex],
              timeInt: defaultBlockTimeInt(),
              formattedTime: formatRoutineTimeFromInt(defaultBlockTimeInt()),
              items: [seriesItem],
            };
            next[emptyIndex] = block;
            targetBlock = block;
            nextBlocks = sortBlocksByTime(next);
            return nextBlocks;
          }

          const adjusted = adjustTimeForMinimumGap(
            defaultBlockTimeInt(),
            prev.map((b) => b.timeInt),
          );
          const timeInt = adjusted ?? defaultBlockTimeInt();
          const block = {
            ...createEmptyBlock(timeInt),
            formattedTime: formatRoutineTimeFromInt(timeInt),
            items: [seriesItem],
          };
          targetBlock = block;
          nextBlocks = sortBlocksByTime([...prev, block]);
          return nextBlocks;
        });

        if (targetBlock) {
          await syncBlockToServer(targetBlock, apiRoutineId);
        }
      } catch {
        Alert.alert(t('series.enroll_error'));
      }
    };

    void hydrateSeriesEnrollment();
  }, [hydrated, enrollSeriesId, contentLanguage, apiRoutineId, syncBlockToServer, t]);

  useEffect(() => {
    if (!hydrated || !initialPlanId || planPrefillHydrated.current) return;
    planPrefillHydrated.current = true;

    const hydratePlanPrefill = async () => {
      try {
        const plan = await fetchPlanById(initialPlanId, contentLanguage);
        const planItem: RoutineItem = {
          id: plan.id,
          title: plan.title,
          coverImage: plan.image ?? null,
          type: 'plan',
          enrolledAt: new Date().toISOString(),
          language: plan.language,
          startDate: plan.start_date,
        };

        let targetBlock: EditableRoutineBlock | null = null;

        setBlocks((prev) => {
          const alreadyExists = prev.some((b) =>
            b.items.some((i) => i.id === plan.id && i.type === 'plan'),
          );
          if (alreadyExists) return prev;

          const emptyIndex = prev.findIndex((b) => b.items.length === 0);
          if (emptyIndex >= 0) {
            const next = [...prev];
            const block = {
              ...next[emptyIndex],
              items: [...next[emptyIndex].items, planItem],
            };
            next[emptyIndex] = block;
            targetBlock = block;
            return sortBlocksByTime(next);
          }

          const adjusted = adjustTimeForMinimumGap(
            defaultBlockTimeInt(),
            prev.map((b) => b.timeInt),
          );
          const timeInt = adjusted ?? defaultBlockTimeInt();
          const block = {
            ...createEmptyBlock(timeInt),
            formattedTime: formatRoutineTimeFromInt(timeInt),
            items: [planItem],
          };
          targetBlock = block;
          return sortBlocksByTime([...prev, block]);
        });

        if (targetBlock) {
          await syncBlockToServer(targetBlock, apiRoutineId);
        }
      } catch {
        Alert.alert(t('series.enroll_error'));
      }
    };

    void hydratePlanPrefill();
  }, [hydrated, initialPlanId, contentLanguage, apiRoutineId, syncBlockToServer, t]);

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
  const shouldShowAddButton =
    (blocks.length === 0 || !isLastBlockEmpty) && canAddBlock(blocks.length);
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
      return prev.filter((b) => b.localId !== localId);
    });
  };

  const removeItemAt = (blockLocalId: string, itemIndex: number) => {
    setBlocks((prev) => {
      const next = prev.map((b) => {
        if (b.localId !== blockLocalId) return b;
        const items = b.items.filter((_, i) => i !== itemIndex);
        return { ...b, items };
      });
      const droppedApiIds = next
        .filter((b) => b.items.length === 0 && b.apiTimeBlockId)
        .map((b) => b.apiTimeBlockId!);
      if (droppedApiIds.length) {
        setRemovedBlockIds((ids) => [...ids, ...droppedApiIds]);
      }
      return next.filter((b) => b.items.length > 0);
    });
  };

  const reorderItemsInBlock = (blockLocalId: string, items: RoutineItem[]) => {
    updateBlock(blockLocalId, { items });
  };

  const collectBlockIdsToDelete = (
    workingRemovedIds: string[],
    workingBlocks: EditableRoutineBlock[],
    toSave: EditableRoutineBlock[],
  ): Set<string> => {
    const ids = new Set(workingRemovedIds);
    const keepingIds = new Set(
      toSave.map((b) => b.apiTimeBlockId).filter((id): id is string => !!id),
    );
    for (const block of workingBlocks) {
      if (block.apiTimeBlockId && block.items.length === 0) {
        ids.add(block.apiTimeBlockId);
      }
    }
    for (const block of routine?.blocks ?? []) {
      if (!keepingIds.has(block.id)) ids.add(block.id);
    }
    return ids;
  };

  const exitAfterSave = () => setAllowLeave(true);

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
    let workingBlocks = blocks;
    let workingRemovedIds = removedBlockIds;

    if (emptyBlockCount > 0) {
      const hasMultiple = emptyBlockCount > 1;
      const result = await confirmChoice({
        title: hasMultiple
          ? t('editRoutine.empty_block_title_plural', { count: emptyBlockCount })
          : t('editRoutine.empty_block_title'),
        message: hasMultiple
          ? t('editRoutine.empty_block_message_plural', { count: emptyBlockCount })
          : t('editRoutine.empty_block_message'),
        secondaryLabel: t('editRoutine.empty_block_add_items'),
        primaryLabel: hasMultiple
          ? t('editRoutine.empty_block_delete_plural')
          : t('editRoutine.empty_block_delete'),
      });
      if (result !== 'primary') return;
      const emptyApiIds = workingBlocks
        .filter((b) => b.items.length === 0 && b.apiTimeBlockId)
        .map((b) => b.apiTimeBlockId!);
      workingRemovedIds = [...workingRemovedIds, ...emptyApiIds];
      workingBlocks = workingBlocks.filter((b) => b.items.length > 0);
      setRemovedBlockIds(workingRemovedIds);
      setBlocks(workingBlocks);
    }

    const toSave = workingBlocks.filter((b) => b.items.length > 0);
    if (!toSave.length) {
      setSaving(true);
      try {
        if (apiRoutineId) {
          const blockIdsToDelete = collectBlockIdsToDelete(workingRemovedIds, workingBlocks, toSave);
          for (const blockId of blockIdsToDelete) {
            await removeTimeBlock.mutateAsync({ routineId: apiRoutineId, blockId });
          }
        }
        exitAfterSave();
      } catch (e) {
        const message = e instanceof Error ? e.message : t('practice.routine_load_error');
        Alert.alert(message);
      } finally {
        setSaving(false);
      }
      return;
    }

    setSaving(true);
    try {
      let routineId = apiRoutineId;

      if (routineId) {
        const blockIdsToDelete = collectBlockIdsToDelete(workingRemovedIds, workingBlocks, toSave);
        for (const blockId of blockIdsToDelete) {
          await removeTimeBlock.mutateAsync({ routineId, blockId });
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

      exitAfterSave();
    } catch (e) {
      const message = e instanceof Error ? e.message : t('practice.routine_load_error');
      Alert.alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FDFDFC]" style={{ paddingTop: insets.top }}>
        <ActivityIndicator size="large" />
        <Text className="mt-4 font-semibold">
          {t('editRoutine.title')}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FDFDFC]" style={{ paddingTop: insets.top }}>
      <View className="flex-1 px-5">
        <View className="h-4" />
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={{ alignSelf: 'flex-end', opacity: saving ? 0.5 : 1 }}
        >
          <Text className="text-base font-medium text-foreground">
            {saving ? t('editRoutine.saving') : t('editRoutine.done')}
          </Text>
        </Pressable>
        <View className="h-2" />
        <Text className="text-[28px] font-bold text-foreground">
          {t('editRoutine.title')}
        </Text>
        <View className="h-3" />
        <View className="h-px bg-[#e8e8e4]" />
        <View className="h-3.5" />

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
                onNotificationToggle={() => {
                  void (async () => {
                    const nextEnabled = !block.notificationEnabled;
                    if (nextEnabled) {
                      await requestNotificationPermissions();
                    }
                    updateBlock(block.localId, {
                      notificationEnabled: nextEnabled,
                    });
                  })();
                }}
                onDeleteBlock={() => removeBlock(block.localId)}
                onAddSession={() =>
                  router.push({
                    pathname: '/practice/edit-routine/select-session',
                    params: { blockLocalId: block.localId },
                  } as Href)
                }
                onDeleteItem={(itemIndex) => removeItemAt(block.localId, itemIndex)}
                onReorderItems={(items) => reorderItemsInBlock(block.localId, items)}
              />
              {index < blocks.length - 1 || shouldShowAddButton ? (
                <View className="py-4">
                  <View className="h-px bg-[#e8e8e4]" />
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
      {dialog}
    </View>
  );
}
