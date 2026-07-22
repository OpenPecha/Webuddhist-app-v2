import { AppColors } from '@/constants/app-colors';
import { useThemeMode } from '@/providers/theme';
import { useCSSVariable } from 'uniwind';

/** Theme-aware colors for components that don't support Uniwind className (e.g. Phosphor icons). */
export function useThemeColors() {
  const { isDark } = useThemeMode();
  const foreground = String(useCSSVariable('--color-foreground') ?? '#000000');
  const mutedForeground = String(useCSSVariable('--color-muted-foreground') ?? '#8a8a8a');
  const destructive = String(useCSSVariable('--color-destructive') ?? '#dc341e');
  const brand = String(useCSSVariable('--color-brand') ?? '#dead2d');
  const surfaceInput = String(useCSSVariable('--color-surface-input') ?? '#ffffff');
  const borderInput = String(useCSSVariable('--color-border-input') ?? '#d4d4d4');
  const cardSurface = isDark ? AppColors.surfaceVariantDark : '#FFFFFF';
  const cardBorder = isDark ? '#353535' : AppColors.cardBorderLight;
  const scaffoldBackground = isDark ? '#000000' : AppColors.surfaceLight;
  const meCardSurface = isDark ? AppColors.meCardDark : '#FFFFFF';
  const shortcutCard = isDark ? AppColors.surfaceVariantDark : AppColors.grey100;
  const sharePromptBg = isDark ? AppColors.surfaceVariantDark : AppColors.sharePromptBgLight;
  const skeleton = isDark ? '#353535' : AppColors.skeletonLight;
  const skeletonMid = isDark ? '#454545' : AppColors.skeletonMid;
  return {
    foreground,
    mutedForeground,
    destructive,
    brand,
    surfaceInput,
    borderInput,
    cardSurface,
    cardBorder,
    scaffoldBackground,
    meCardSurface,
    shortcutCard,
    sharePromptBg,
    skeleton,
    skeletonMid,
    isDark,
  };
}
