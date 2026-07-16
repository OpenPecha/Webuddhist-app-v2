import { Text } from '@/components/ui/text';
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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#e8e8e4',
        backgroundColor: '#F9F8F4',
      }}
    >
      <View style={{ width: 48, alignItems: 'flex-start' }}>
        {canPrev ? (
          <Pressable
            onPress={onPrev}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.3)',
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </Pressable>
        ) : (
          <View style={{ width: 40, height: 40 }} />
        )}
      </View>

      <Text className="flex-1 text-center text-base font-bold text-foreground" numberOfLines={1}>
        {title}
      </Text>

      <View style={{ width: 48, alignItems: 'flex-end' }}>
        <Pressable
          onPress={handleNext}
          disabled={!canNext && !onFinish}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: canNext || onFinish ? '#000' : 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
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
