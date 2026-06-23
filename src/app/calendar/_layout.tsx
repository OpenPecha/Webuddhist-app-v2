import { Stack } from 'expo-router';

/** Full-screen Tibetan calendar — mirrors Flutter `/home/calendar` (no tab bar). */
export default function CalendarLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FDFDFC' } }} />
  );
}
