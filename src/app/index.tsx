import { Text, View, ActivityIndicator, Pressable } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { AUTH0_CUSTOM_SCHEME } from "@/providers/auth0";

export default function Index() {
  const { authorize, clearSession, user, isLoading, error } = useAuth0();

  const login = async () => {
    try {
      await authorize(
        { scope: "openid profile email" },
        { customScheme: AUTH0_CUSTOM_SCHEME }
      );
    } catch (e) {
      console.error("Login error:", e);
    }
  };

  const logout = async () => {
    try {
      await clearSession({}, { customScheme: AUTH0_CUSTOM_SCHEME });
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 px-6">
      <Text className="text-foreground text-2xl font-bold">WeBuddhist</Text>

      {user ? (
        <>
          <Text className="text-foreground text-lg">
            Welcome, {user.name || user.email}!
          </Text>
          {user.email && (
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
        </>
      ) : (
        <>
          <Text className="text-muted-foreground text-center">
            Sign in to access your account
          </Text>
          <Pressable
            onPress={login}
            className="mt-4 rounded-lg bg-primary px-6 py-3 active:opacity-80"
          >
            <Text className="text-primary-foreground font-semibold">
              Log In
            </Text>
          </Pressable>
        </>
      )}

      {error && (
        <Text className="text-destructive mt-4 text-center">
          {error.message}
        </Text>
      )}
    </View>
  );
}
