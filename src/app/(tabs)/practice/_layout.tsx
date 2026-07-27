import { usePendingRoutineNavigation } from '@/hooks/usePendingRoutineNavigation';
import { Stack } from 'expo-router';

/** Stack inside the Practice tab so explore sub-screens keep the bottom tab bar visible. */
export default function PracticeLayout() {
  usePendingRoutineNavigation();

  return <Stack screenOptions={{ headerShown: false }} />;
}
