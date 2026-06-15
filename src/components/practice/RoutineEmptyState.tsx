import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

const calendarImage = require('../../../assets/images/bgimage1.jpg');

interface RoutineEmptyStateProps {
  onBuildRoutine: () => void;
}

/** Matches Flutter RoutineEmptyState (illustration, description, CTA). */
export function RoutineEmptyState({ onBuildRoutine }: RoutineEmptyStateProps) {
  const { t } = useTranslation();
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
      <View style={{ alignItems: 'center', gap: 32 }}>
        <Image
          source={calendarImage}
          style={{
            width: width * 0.5,
            height: height * 0.2,
            borderRadius: 20,
          }}
          contentFit="cover"
        />
        <Text
          style={{
            fontSize: 15,
            lineHeight: 22,
            textAlign: 'center',
            color: '#8a8a8a',
            fontFamily: 'Inter-Regular',
            paddingHorizontal: 20,
          }}
        >
          {t('practice.routine_empty_description')}
        </Text>
        <Pressable
          onPress={onBuildRoutine}
          style={{
            width: '100%',
            backgroundColor: '#000',
            borderRadius: 30,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '600',
              fontFamily: 'Inter-SemiBold',
            }}
          >
            {t('practice.routine_build')}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
