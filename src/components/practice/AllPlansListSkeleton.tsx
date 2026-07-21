import { View } from 'react-native';

function SkeletonBlock({ className }: { className: string }) {
  return <View className={`bg-muted/40 ${className}`} />;
}

export function AllPlansListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <View className="gap-3 px-4 pt-2">
      {Array.from({ length: rows }).map((_, index) => (
        <View
          key={index}
          className="flex-row items-center gap-3 rounded-2xl bg-card p-3"
        >
          <SkeletonBlock className="h-14 w-14 rounded-xl" />
          <View className="flex-1 gap-2">
            <SkeletonBlock className="h-3.5 w-3/4 rounded" />
            <SkeletonBlock className="h-3 w-1/2 rounded" />
            <SkeletonBlock className="h-1.5 w-2/5 rounded" />
          </View>
        </View>
      ))}
    </View>
  );
}
