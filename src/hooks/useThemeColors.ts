import { useCSSVariable } from 'uniwind';

/** Theme-aware colors for components that don't support Uniwind className (e.g. Phosphor icons). */
export function useThemeColors() {
  const foreground = String(useCSSVariable('--color-foreground') ?? '#000000');
  const mutedForeground = String(useCSSVariable('--color-muted-foreground') ?? '#8a8a8a');
  const destructive = String(useCSSVariable('--color-destructive') ?? '#dc341e');
  const brand = String(useCSSVariable('--color-brand') ?? '#dead2d');
  const surfaceInput = String(useCSSVariable('--color-surface-input') ?? '#ffffff');
  const borderInput = String(useCSSVariable('--color-border-input') ?? '#d4d4d4');
  return { foreground, mutedForeground, destructive, brand, surfaceInput, borderInput };
}
