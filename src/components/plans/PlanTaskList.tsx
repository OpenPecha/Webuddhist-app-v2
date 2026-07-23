import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
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
      className={cn(
        'w-6 h-6 rounded-full items-center justify-center',
        completed ? 'border-0' : 'border border-black',
      )}
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
      className="w-10 h-10 rounded-full border border-black/30 items-center justify-center"
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

  if (tasks.length === 0) {
    return (
      <Text className="text-muted-foreground text-center mt-6 px-5">{"No tasks for this day"}</Text>
    );
  }

  return (
    <View className="px-4 pb-8">
      {tasks.map((task) => {
        const completed = optimisticCompleted[task.id] ?? task.is_completed === true;
        const navigable = isTaskNavigable(task);
        const hasAudio = taskHasAudio(task, dayAudioUrl);

        return (
          <View
            key={task.id}
            className="flex-row items-center my-2.5 gap-2.5"
          >
            {!readOnly && onToggleTask ? (
              <TaskCheckbox
                completed={completed}
                onToggle={() => onToggleTask(task.id, completed)}
              />
            ) : null}

            <Pressable
              className="flex-1"
              disabled={!navigable}
              onPress={() => onPressTask?.(task.id)}
            >
              <Text className="text-base font-medium text-foreground" numberOfLines={2}>
                {task.title ?? "Task"}
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
