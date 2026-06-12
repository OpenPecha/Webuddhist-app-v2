import { RecitationCard } from '@/components/recitation/RecitationCard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, Text, View } from 'react-native';

const image = require('../../../assets/images/bgimage2.jpg');
const image2 = require('../../../assets/images/bgimage3.jpg');
const image3 = require('../../../assets/images/bgimage4.jpg');

export function Recitation() {
  const dummydata = [
    { id: '1', title: 'The Way of Boddisatva', description: 'Prayers to the Buddha', image, duration: '10:00' },
    { id: '2', title: 'Prayerts to the 21 Taras', description: 'Prayers to the Taras', image: image2, duration: '10:00' },
    { id: '3', title: 'Chants of the Heart', description: 'Chanting to the Dolma', image: image3, duration: '10:00' },
  ];

  return (
    <>
      <View className="flex-row items-center">
        <Text className="text-foreground text-lg font-semibold">Recitations</Text>
        <Pressable className="p-2">
          <MaterialIcons name="arrow-forward-ios" size={12} />
        </Pressable>
      </View>

      {dummydata && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {dummydata.map((data) => (
            <RecitationCard key={data.id} data={data} />
          ))}
        </ScrollView>
      )}
    </>
  );
}
