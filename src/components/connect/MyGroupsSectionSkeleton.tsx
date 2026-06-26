import { View } from 'react-native';

export function MyGroupsSectionSkeleton() {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
      <View style={{ width: 100, height: 12, backgroundColor: '#e8e8e4', borderRadius: 6, marginBottom: 12 }} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ width: 72, alignItems: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#e8e8e4' }} />
            <View style={{ width: 56, height: 10, backgroundColor: '#e8e8e4', borderRadius: 4, marginTop: 8 }} />
          </View>
        ))}
      </View>
    </View>
  );
}
