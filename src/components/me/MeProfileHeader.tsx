import { ProfileAvatar } from '@/components/settings/ProfileAvatar';
import { Text } from '@/components/ui/text';
import {
  resolveProfileAvatarUrl,
  resolveProfileDisplayName,
  resolveProfileEmail,
} from '@/lib/profile-display';
import type { UserProfile } from '@/types/user';
import { View } from 'react-native';
import type { User } from 'react-native-auth0';

interface MeProfileHeaderProps {
  profile?: UserProfile | null;
  authUser?: User | null;
  loading?: boolean;
}

export function MeProfileHeader({ profile, authUser, loading = false }: MeProfileHeaderProps) {
  const avatarUrl = resolveProfileAvatarUrl(profile, authUser);
  const displayName = resolveProfileDisplayName(profile, authUser);
  const email = resolveProfileEmail(profile, authUser);
  const bio = profile?.about_me?.trim() ?? '';

  return (
    <View className="px-5 pt-2">
      <View className="flex-row items-start">
        <ProfileAvatar url={avatarUrl} size={80} loading={loading && !avatarUrl} />
        <View className="ml-4 flex-1 pt-2">
          {displayName ? (
            <Text className="text-xl font-bold">{displayName}</Text>
          ) : loading ? (
            <View className="h-6 w-32 rounded bg-muted" />
          ) : null}
          {email ? (
            <Text className="mt-1 text-sm text-muted-foreground">{email}</Text>
          ) : null}
        </View>
      </View>
      {bio ? (
        <Text className="mt-4 text-sm leading-[1.4]">{bio}</Text>
      ) : null}
    </View>
  );
}
