import { ImageBackground, Text, View } from 'react-native';
const backgroundImage = require('../../../../assets/images/bgimage1.jpg');

interface QuotationProps {
    quote?: string;
    author?: string;
}

export function Quotation({
    quote = '"The mind is everything. What you think you become."',
    author = '— Buddha',
}: QuotationProps) {
    return (
        <View className="overflow-hidden rounded-2xl">
            <ImageBackground
                source={backgroundImage}
                className="w-full min-h-48 items-center justify-center"
                resizeMode="cover"
            >
                <View className="items-center rounded-xl">
                    <Text className="text-center font-garamond text-xl leading-relaxed text-white">
                        {quote}
                    </Text>
                    {author && (
                        <Text className="mt-3 font-garamond text-base text-white/80">
                            {author}
                        </Text>
                    )}
                </View>
            </ImageBackground>
        </View>
    );
}
