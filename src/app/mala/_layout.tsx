import { Stack } from 'expo-router';

/** Full-screen mala counter — mirrors Flutter `/mala` (no tab bar). */
export default function MalaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FDFDFC' } }} />
  );
}
