import { View } from 'react-native';

function SkeletonBlock({ className }: { className: string }) {
  return <View className={`bg-muted/40 ${className}`} />;
}

export function RecitationsListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <View className="pt-2">
      {Array.from({ length: rows }).map((_, index) => (
        <View
          key={index}
          className="mx-4 mb-2 overflow-hidden rounded-xl bg-card px-4 py-2.5"
        >
          <View className="flex-row items-stretch">
            <SkeletonBlock className="w-1 self-stretch rounded-sm" />
            <View className="ml-3 flex-1 justify-center gap-2 py-1">
              <SkeletonBlock className="h-3.5 w-3/4 rounded" />
              <SkeletonBlock className="h-3 w-full rounded" />
              <SkeletonBlock className="h-3 w-2/3 rounded" />
            </View>
            <View className="ml-2 justify-center">
              <SkeletonBlock className="h-10 w-10 rounded-full" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
