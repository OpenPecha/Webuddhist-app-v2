import { Text } from '@/components/ui/text';
import { APP_ASSETS } from '@/constants/app-assets';
import { Image } from 'expo-image';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

interface RoutineEmptyStateProps {
  onBuildRoutine: () => void;
}

/** Matches Flutter RoutineEmptyState (illustration, description, CTA). */
export function RoutineEmptyState({ onBuildRoutine }: RoutineEmptyStateProps) {
  const { width, height } = useWindowDimensions();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
      }}
    >
      <View className="items-center gap-8">
        <Image
          source={APP_ASSETS.routineCalendar}
          style={{
            width: width * 0.5,
            height: height * 0.2,
            borderRadius: 20,
          }}
          contentFit="cover"
        />
        <Text className="px-5 text-center text-[15px] leading-[22px] text-muted-foreground">
          {"Explore more teachings and practices to enroll in or add to your routine"}
        </Text>
        <Pressable
          onPress={onBuildRoutine}
          className="w-full bg-black rounded-[30px] py-4 items-center"
        >
          <Text className="text-base font-semibold text-white">{"Build your routine"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
