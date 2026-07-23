import { LoginDrawer } from '@/components/auth/LoginDrawer';
import { useIsBookmarked } from '@/hooks/api/useBookmarkExists';
import { useToggleBookmark } from '@/hooks/api/useToggleBookmark';
import { useLoginDrawer } from '@/hooks/useLoginDrawer';
import { useGuest } from '@/providers/guest';
import { Ionicons } from '@expo/vector-icons';
import { useAuth0 } from 'react-native-auth0';
import { ActivityIndicator, Pressable } from 'react-native';

interface ReaderBookmarkButtonProps {
  textId: string;
  textTitle?: string;
}

export function ReaderBookmarkButton({ textId, textTitle }: ReaderBookmarkButtonProps) {
  const { user } = useAuth0();
  const { isGuest } = useGuest();
  const { visible, session, showLoginDrawer, hideLoginDrawer } = useLoginDrawer();
  const { isBookmarked, isLoading } = useIsBookmarked(textId, 'TEXT', !!textId);
  const toggle = useToggleBookmark();

  const handlePress = () => {
    if (isGuest || !user) {
      showLoginDrawer();
      return;
    }
    toggle.mutate({ type: 'TEXT', sourceId: textId, name: textTitle });
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        disabled={toggle.isPending}
        className="p-2 active:opacity-80"
        style={{ opacity: toggle.isPending ? 0.5 : 0.85 }}
        accessibilityRole="button"
        accessibilityLabel={isBookmarked ? "Bookmarked" : "Bookmark"}
      >
        {toggle.isPending || isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color="#000"
          />
        )}
      </Pressable>
      <LoginDrawer key={session} visible={visible} onClose={hideLoginDrawer} />
    </>
  );
}
