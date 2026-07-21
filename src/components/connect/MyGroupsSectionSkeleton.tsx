import { View } from 'react-native';

export function MyGroupsSectionSkeleton() {
  return (
    <View className="mb-6 px-5">
      <View className="mb-3 h-3 w-[100px] rounded-md bg-[#e8e8e4]" />
      <View className="flex-row gap-3">
        {[0, 1, 2].map((i) => (
          <View key={i} className="w-[72px] items-center">
            <View className="h-16 w-16 rounded-full bg-[#e8e8e4]" />
            <View className="mt-2 h-2.5 w-14 rounded bg-[#e8e8e4]" />
          </View>
        ))}
      </View>
    </View>
  );
}
