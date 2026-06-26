import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { isTaskNavigable, taskHasAudio } from '@/utils/plan-subtask-navigation';

export interface PlanTaskListItem {
  id: string;
  title?: string | null;
  is_completed?: boolean;
  subtasks: {
    id: string;
    content?: string | null;
    is_completed?: boolean;
    content_type?: string;
    source_text_id?: string | null;
    audio_url?: string | null;
  }[];
}

interface PlanTaskListProps {
  tasks: PlanTaskListItem[];
  readOnly?: boolean;
  variant?: 'card' | 'activity';
  dayAudioUrl?: string | null;
  onToggleTask?: (taskId: string, completed: boolean) => void;
  onToggleSubTask?: (subTaskId: string, completed: boolean) => void;
  onPressTask?: (taskId: string) => void;
  onPressTaskWithAudio?: (taskId: string) => void;
  optimisticCompleted?: Record<string, boolean>;
}

function TaskCheckbox({
  completed,
  onToggle,
}: {
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: completed ? 0 : 1,
        borderColor: '#000',
        backgroundColor: completed ? 'transparent' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {completed ? <Ionicons name="checkmark" size={20} color="#000" /> : null}
    </Pressable>
  );
}

function CircleActionButton({
  icon,
  onPress,
}: {
  icon: 'chevron-forward' | 'play';
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons
        name={icon === 'play' ? 'play' : 'chevron-forward'}
        size={icon === 'play' ? 22 : 16}
        color="#000"
        style={icon === 'play' ? { marginLeft: 2 } : undefined}
      />
    </Pressable>
  );
}

export function PlanTaskList({
  tasks,
  readOnly = true,
  variant = 'card',
  dayAudioUrl,
  onToggleTask,
  onToggleSubTask,
  onPressTask,
  onPressTaskWithAudio,
  optimisticCompleted = {},
}: PlanTaskListProps) {
  const { t } = useTranslation();

  if (tasks.length === 0) {
    return (
      <Text style={{ color: '#8a8a8a', textAlign: 'center', marginTop: 24, paddingHorizontal: 20 }}>
        {t('planTrack.no_tasks')}
      </Text>
    );
  }

  if (variant === 'activity') {
    return (
      <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {tasks.map((task) => {
          const completed = optimisticCompleted[task.id] ?? task.is_completed === true;
          const navigable = isTaskNavigable(task);
          const hasAudio = taskHasAudio(task, dayAudioUrl);

          return (
            <View
              key={task.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
                gap: 10,
              }}
            >
              {!readOnly && onToggleTask ? (
                <TaskCheckbox
                  completed={completed}
                  onToggle={() => onToggleTask(task.id, completed)}
                />
              ) : completed ? (
                <Ionicons name="checkmark" size={20} color="#000" />
              ) : (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#000',
                  }}
                />
              )}

              <Pressable
                style={{ flex: 1 }}
                disabled={!navigable}
                onPress={() => onPressTask?.(task.id)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    fontFamily: 'Inter-Medium',
                    color: '#000',
                  }}
                  numberOfLines={2}
                >
                  {task.title ?? t('plans.preview.untitled_task')}
                </Text>
              </Pressable>

              {navigable && hasAudio && onPressTaskWithAudio ? (
                <CircleActionButton icon="play" onPress={() => onPressTaskWithAudio(task.id)} />
              ) : navigable ? (
                <CircleActionButton icon="chevron-forward" onPress={() => onPressTask?.(task.id)} />
              ) : null}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
      {tasks.map((task) => {
        const completed = optimisticCompleted[task.id] ?? task.is_completed === true;
        return (
          <Pressable
            key={task.id}
            disabled={readOnly && !onPressTask}
            onPress={() => onPressTask?.(task.id)}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#e8e8e4',
              opacity: completed && readOnly ? 0.7 : 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              {!readOnly && onToggleTask ? (
                <Pressable
                  onPress={() => onToggleTask(task.id, !completed)}
                  hitSlop={8}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: completed ? '#000' : '#ccc',
                    backgroundColor: completed ? '#000' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2,
                  }}
                >
                  {completed ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
                </Pressable>
              ) : completed ? (
                <Ionicons name="checkmark-circle" size={22} color="#000" style={{ marginTop: 2 }} />
              ) : null}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    fontFamily: 'Inter-SemiBold',
                    marginBottom: task.subtasks.length ? 8 : 0,
                    textDecorationLine: completed ? 'line-through' : 'none',
                  }}
                >
                  {task.title ?? t('plans.preview.untitled_task')}
                </Text>
                {task.subtasks.map((sub) => {
                  const subCompleted = optimisticCompleted[sub.id] ?? sub.is_completed === true;
                  return (
                    <View
                      key={sub.id}
                      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 4 }}
                    >
                      {!readOnly && onToggleSubTask ? (
                        <Pressable
                          onPress={() => onToggleSubTask(sub.id, !subCompleted)}
                          hitSlop={8}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 1.5,
                            borderColor: subCompleted ? '#000' : '#ccc',
                            backgroundColor: subCompleted ? '#000' : 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 2,
                          }}
                        >
                          {subCompleted ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
                        </Pressable>
                      ) : null}
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 14,
                          color: '#444',
                          lineHeight: 20,
                          textDecorationLine: subCompleted ? 'line-through' : 'none',
                        }}
                        numberOfLines={6}
                      >
                        {sub.content}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
