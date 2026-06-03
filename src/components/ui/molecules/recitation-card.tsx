import { StyledImage } from '@/components/styled';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

export function RecitationCard({ data }: { data: any }) {
    return (
        <View className="w-72 flex flex-row overflow-hidden rounded-xl bg-white p-1">
            <StyledImage
                source={data.image}
                className=" size-20 rounded-xl"
                contentFit="cover"
                transition={200}
            />

            <View className="p-3 gap-2">
                <View>
                    <Text
                        className="text-foreground text-sm font-semibold"
                        numberOfLines={2}
                    >
                        {data.title}
                    </Text>
                    <Text
                        className="text-muted-foreground  text-xs"
                        numberOfLines={2}
                    >
                        {data.description}
                    </Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <MaterialIcons name="play-arrow" size={12} color="black" />
                    <Text className="text-muted-foreground text-xs">
                        {data.duration} min
                    </Text>
                </View>
            </View>
        </View>
    );
}
