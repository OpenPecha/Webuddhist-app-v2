import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

export function Calander() {
  return (
    <View className="flex-row items-center justify-between bg-[#ffffff] rounded-xl p-4">
      <View className="flex-row items-center gap-2">
        <View className="w-2 h-2 bg-accent/60 rounded-full" />
        <Text className="text-foreground font-semibold">Buddha Purnima</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <MaterialIcons name="calendar-month" size={12} color="gray" />
        <Text className="text-muted-foreground text-sm">20 October 2026</Text>
      </View>
    </View>
  );
}
