import { Stack } from 'expo-router';

export default function EditRoutineLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FDFDFC' } }}>
      <Stack.Screen name="index" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
