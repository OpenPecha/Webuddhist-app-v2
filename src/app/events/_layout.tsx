import { Stack } from 'expo-router';

/** Full-screen events list — no tab bar. */
export default function EventsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FDFDFC' } }} />
  );
}
