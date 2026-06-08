import { Calander } from '@/components/ui/molecules/homepage/calander';
import { Challenge } from '@/components/ui/molecules/homepage/challenge';
import { Recitation } from '@/components/ui/molecules/homepage/recitation';
import { Quotation } from '@/components/ui/molecules/quotation';
import { greetings } from '@/lib/greeting';
import { useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const { user } = useAuth0();
  const insets = useSafeAreaInsets();
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-3 p-2"
      contentContainerStyle={{
        paddingTop: Platform.OS === 'android' ? insets.top : 0,
      }}
      showsVerticalScrollIndicator={true}
    >
      <View>
        <Text className="text-foreground text-xl font-semibold">
          {greeting}
        </Text>
        <Text className="text-foreground text-xl font-semibold">
          {user?.name} !
        </Text>
        {user?.email && (
          <Text className="text-muted-foreground">{user.email}</Text>
        )}
      </View>
      <Calander />
      <Quotation />
      <Challenge />
      <Recitation />
    </ScrollView>
  );
}
