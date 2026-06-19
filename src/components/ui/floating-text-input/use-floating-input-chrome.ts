import { useThemeColors } from '@/hooks/useThemeColors';
import { useCSSVariable, useUniwind } from 'uniwind';

export function useFloatingInputChrome(focused: boolean, isError: boolean) {
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const { foreground, mutedForeground, destructive } = useThemeColors();
  const background = String(useCSSVariable('--color-background') ?? (isDark ? '#000000' : '#fdfdfc'));

  const defaultBorder = isDark ? '#707070' : '#DADADA';
  const focusBorder = isDark ? '#A1A1A1' : '#454545';

  const borderColor = isError ? destructive : focused ? focusBorder : defaultBorder;
  const borderWidth = isError || focused ? 1.5 : 1;

  return {
    background,
    foreground,
    mutedForeground,
    destructive,
    borderColor,
    borderWidth,
  };
}
