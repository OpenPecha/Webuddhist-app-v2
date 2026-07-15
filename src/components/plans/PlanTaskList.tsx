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
  dayAudioUrl?: string | null;
  onToggleTask?: (taskId: string, completed: boolean) => void;
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
  dayAudioUrl,
  onToggleTask,
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
            ) : null}

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
            ) : navigable && onPressTask ? (
              <CircleActionButton icon="chevron-forward" onPress={() => onPressTask(task.id)} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
