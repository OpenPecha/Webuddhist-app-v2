import { Challenge } from '@/components/ui/molecules/homepage/challenge';
import { Quotation } from '@/components/ui/molecules/quotation';
import { RecitationCard } from '@/components/ui/molecules/recitation-card';
import { greetings } from '@/lib/greeting';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const { user } = useAuth0();
  const insets = useSafeAreaInsets();
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  return (
    <View className=" gap-4 p-4" style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom }}>
      <View>
        <Text className="text-foreground text-xl font-semibold">
          {greeting}
        </Text>
        <Text className='text-foreground text-xl font-semibold'>
          {user?.name}
        </Text>
        {user?.email && (
          <Text className="text-muted-foreground">{user.email}</Text>
        )}
      </View>
      <Quotation />
      <Challenge />
      <RecitationCard />
    </View>
  );
}
