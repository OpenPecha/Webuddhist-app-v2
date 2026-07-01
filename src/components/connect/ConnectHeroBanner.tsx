import { CONNECT_HERO, CONNECT_PADDING } from '@/components/connect/connect-styles';
import { useThemeColors } from '@/hooks/useThemeColors';
import { LinearGradient } from 'expo-linear-gradient';
import { UsersThree } from 'phosphor-react-native';
import { View } from 'react-native';

/** Empty my-groups hero — mirrors Flutter `AppAssets.connect` when no image asset is bundled. */
export function ConnectHeroBanner() {
  const { brand, foreground, isDark, shortcutCard } = useThemeColors();

  return (
    <View
      style={{
        marginHorizontal: CONNECT_PADDING,
        borderRadius: CONNECT_HERO.borderRadius,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={isDark ? [shortcutCard, '#1a1a1a'] : [brand + '33', brand + '14']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          aspectRatio: CONNECT_HERO.aspectRatio,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UsersThree size={48} color={foreground} weight="duotone" />
      </LinearGradient>
    </View>
  );
}
