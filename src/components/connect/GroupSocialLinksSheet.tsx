import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Text } from '@/components/ui/text';
import { Linking, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface GroupSocialLinksSheetProps {
  links: SocialLink[];
}

function platformIcon(platform: string): keyof typeof Ionicons.glyphMap {
  const key = platform.toLowerCase();
  if (key.includes('instagram')) return 'logo-instagram';
  if (key.includes('facebook')) return 'logo-facebook';
  if (key.includes('youtube')) return 'logo-youtube';
  if (key.includes('twitter') || key === 'x') return 'logo-twitter';
  if (key.includes('website') || key.includes('web')) return 'globe-outline';
  return 'link-outline';
}

export const GroupSocialLinksSheet = forwardRef<BottomSheetModal, GroupSocialLinksSheetProps>(
  function GroupSocialLinksSheet({ links }, ref) {
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ['40%'], []);

    const renderBackdrop = useCallback(
      (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      [],
    );

    return (
      <BottomSheetModal ref={ref} snapPoints={snapPoints} backdropComponent={renderBackdrop}>
        <BottomSheetView className="px-5" style={{ paddingBottom: insets.bottom + 16 }}>
          <Text className="mb-4 text-[17px] font-bold">{"Links"}</Text>
          {links.map((link) => (
            <Pressable
              key={link.id}
              onPress={() => void Linking.openURL(link.url)}
              className="flex-row items-center border-b border-border py-3.5 active:opacity-75"
            >
              <Ionicons name={platformIcon(link.platform)} size={22} color="#000" />
              <Text className="ml-3 flex-1 text-[15px] font-medium text-foreground">{link.platform}</Text>
              <Ionicons name="open-outline" size={18} color="#8a8a8a" />
            </Pressable>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
