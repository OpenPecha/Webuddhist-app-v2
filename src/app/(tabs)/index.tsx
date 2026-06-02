import { Text, View, Pressable } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { AUTH0_CUSTOM_SCHEME } from '@/providers/auth0';

export default function Index() {
  const { clearSession, user } = useAuth0();

  const logout = async () => {
    try {
      await clearSession({}, { customScheme: AUTH0_CUSTOM_SCHEME });
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-4 px-6">
      <Text className="text-foreground text-2xl font-bold">WeBuddhist</Text>
      <Text className="text-foreground text-lg">
        Welcome, {user?.name || user?.email}!
      </Text>
      {user?.email && (
        <Text className="text-muted-foreground">{user.email}</Text>
      )}
      <Pressable
        onPress={logout}
        className="mt-4 rounded-lg bg-destructive px-6 py-3 active:opacity-80"
      >
        <Text className="text-destructive-foreground font-semibold">
          Log Out
        </Text>
      </Pressable>
    </View>
  );
}
