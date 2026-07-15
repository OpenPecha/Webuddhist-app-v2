import { ProfileAvatar } from '@/components/settings/ProfileAvatar';
import { Plus } from 'phosphor-react-native';
import { ActivityIndicator, Pressable, View } from 'react-native';

interface ProfileAvatarSectionProps {
  url?: string | null;
  isUploading?: boolean;
  onEditTap: () => void;
}

/** Matches Flutter `ProfileAvatarSection` — avatar with + badge. */
export function ProfileAvatarSection({ url, isUploading, onEditTap }: ProfileAvatarSectionProps) {
  return (
    <View className="items-center">
      <View style={{ width: 104, height: 104 }}>
        <ProfileAvatar url={url} size={104} loading={isUploading && !url} />
        {isUploading ? (
          <View
            className="absolute inset-0 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.38)' }}
          >
            <ActivityIndicator color="#fff" />
          </View>
        ) : null}
        <Pressable
          onPress={onEditTap}
          disabled={isUploading}
          className="absolute -bottom-0 -right-0 h-7 w-7 items-center justify-center rounded-full bg-black active:opacity-80"
          style={{ bottom: 0, right: 0 }}
        >
          <Plus size={18} color="#fff" weight="bold" />
        </Pressable>
      </View>
    </View>
  );
}
