import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

interface PlanNavigatorProps {
  title: string;
  canPrev?: boolean;
  canNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
}

export function PlanNavigator({
  title,
  canPrev = true,
  canNext = true,
  onPrev,
  onNext,
  onFinish,
}: PlanNavigatorProps) {
  const handleNext = canNext ? onNext : onFinish;

  return (
    <View className="flex-row items-center px-4 py-3 border-t border-[#e8e8e4] bg-[#F9F8F4]">
      <View className="w-12 items-start">
        {canPrev ? (
          <Pressable
            onPress={onPrev}
            className="w-10 h-10 rounded-full border border-black/30 bg-white items-center justify-center"
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </Pressable>
        ) : (
          <View className="w-10 h-10" />
        )}
      </View>

      <Text className="flex-1 text-center text-base font-bold text-foreground" numberOfLines={1}>
        {title}
      </Text>

      <View className="w-12 items-end">
        <Pressable
          onPress={handleNext}
          disabled={!canNext && !onFinish}
          className={cn(
            'w-10 h-10 rounded-full items-center justify-center',
            canNext || onFinish ? 'bg-black' : 'bg-black/20',
          )}
        >
          <Ionicons
            name={canNext ? 'chevron-forward' : 'checkmark'}
            size={20}
            color="#fff"
          />
        </Pressable>
      </View>
    </View>
  );
}
