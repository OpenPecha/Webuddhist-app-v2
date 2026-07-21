import { View } from 'react-native';

export function BookmarkListSkeleton() {
  return (
    <View className="px-4 pt-4">
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          className="h-[72px] rounded-xl bg-[#ecece8] mb-3 opacity-70"
        />
      ))}
    </View>
  );
}
