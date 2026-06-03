import { AUTH0_CUSTOM_SCHEME } from '@/providers/auth0';
import { Pressable, Text, View } from "react-native";
import { useAuth0 } from 'react-native-auth0';

export default function SettingScreen() {
    const { clearSession } = useAuth0();

    const logout = async () => {
        try {
            await clearSession({}, { customScheme: AUTH0_CUSTOM_SCHEME });
        } catch (e) {
            console.error('Logout error:', e);
        }
    };
    return (
        <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-foreground text-lg">
                Setting page
            </Text>
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
