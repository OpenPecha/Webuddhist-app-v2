import { Stack } from 'expo-router';

/** Stack inside the Home tab so Chants screens keep the bottom tab bar visible. */
export default function HomeLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
