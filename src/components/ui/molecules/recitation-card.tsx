import { StyledImage } from '@/components/styled';
import { Text, View } from 'react-native';
const backgroundImage = require('../../../../assets/images/bgimage2.jpg');

export function RecitationCard() {
    return (
        <View className="w-72 flex bg-white flex-row overflow-hidden p-1 rounded-2xl">
            <StyledImage
                source={backgroundImage}
                className=" size-20 rounded-2xl"
                contentFit="cover"
                transition={200}
            />

            <View className="p-3">
                <Text
                    className="text-foreground text-sm font-semibold"
                    numberOfLines={2}
                >
                    The Way of Boddisatva
                </Text>
                <Text
                    className="text-muted-foreground mt-1 text-xs"
                    numberOfLines={2}
                >
                    Prayers to the Buddha
                </Text>


            </View>
        </View>
    );
}
