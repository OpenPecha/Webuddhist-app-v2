import { Quotation } from '@/components/quotation';
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
    <View className="flex-1 gap-4 p-4" style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom }}>
      <View>
        <Text className="text-foreground  max-w-36 text-xl font-semibold">
          {greeting}, {user?.name}
        </Text>
        {user?.email && (
          <Text className="text-muted-foreground">{user.email}</Text>
        )}
      </View>
      <Quotation />
    </View>
  );
}
