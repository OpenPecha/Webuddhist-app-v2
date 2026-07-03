import { View } from 'react-native';

export function BookmarkListSkeleton() {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            height: 72,
            borderRadius: 12,
            backgroundColor: '#ecece8',
            marginBottom: 12,
            opacity: 0.7,
          }}
        />
      ))}
    </View>
  );
}
