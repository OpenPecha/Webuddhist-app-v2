import { Plan } from '@/hooks/useSeries';
import { imageUrl } from '@/lib/image-url';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from "expo-image";
import { Text, View } from "react-native";

export function PlanCard({ plan }: { plan: Plan }) {
    return (
        <View className="flex-row gap-3 rounded-xl bg-card p-1">
            <Image
                source={{ uri: imageUrl(plan.image, 'thumbnail') }}
                style={{ height: 72, width: 72, borderRadius: 8 }}
                contentFit="cover"
                transition={200}
            />
            <View className="flex-1 justify-center">
                <Text className="text-foreground text-sm font-semibold" numberOfLines={2}>
                    {plan.title}
                </Text>
                {plan.description ? (
                    <Text className="text-muted-foreground text-xs" numberOfLines={2}>
                        {plan.description}
                    </Text>
                ) : null}
                <View className="mt-1 flex-row items-center gap-2">
                    <View className="flex-row items-center gap-0.5">
                        <MaterialIcons
                            name="signal-cellular-alt"
                            size={12}
                            color={
                                plan.difficulty_level.toLowerCase() === "beginner"
                                    ? "green"
                                    : plan.difficulty_level.toLowerCase() === "intermediate"
                                        ? "yellow"
                                        : plan.difficulty_level.toLowerCase() === "advanced"
                                            ? "orange"
                                            : "gray"
                            }
                        />
                        <Text className="text-muted-foreground text-xs">
                            {plan.difficulty_level.charAt(0) + plan.difficulty_level.slice(1).toLowerCase()}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-0.5">
                        <MaterialIcons name="calendar-month" size={12} color="gray" />
                        <Text className="text-muted-foreground text-xs">
                            {plan.total_days} {plan.total_days === 1 ? 'day' : 'days'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
