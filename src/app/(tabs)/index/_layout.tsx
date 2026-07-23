import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'home',
};

/** Stack inside the Home tab so Chants screens keep the bottom tab bar visible. */
export default function HomeLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
