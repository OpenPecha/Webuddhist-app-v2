import { Stack } from 'expo-router';

/** Stack inside the Me tab so settings screens keep the bottom tab bar visible. */
export default function MeLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
