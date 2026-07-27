import { AppBottomTabBar } from '@/components/navigation/AppBottomTabBar';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={(props) => <AppBottomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="practice" />
      <Tabs.Screen name="connect" />
      <Tabs.Screen name="me" />
    </Tabs>
  );
}
