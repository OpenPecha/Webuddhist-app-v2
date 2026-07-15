export const BEADS_PER_ROUND = 108;

export interface AccumulatorMetadata {
  language: string;
  name: string;
  description?: string | null;
}

export interface MantraText {
  id: string;
  text: string;
  title?: string | null;
  pronunciation?: string | null;
  audioUrl?: string | null;
  beadImageUrl?: string | null;
}

export interface Mantra {
  presetId: string;
  targetCount?: number | null;
  beadImageUrl?: string | null;
  metadata: AccumulatorMetadata[];
  mantra?: MantraText | null;
}

export interface MalaCount {
  accumulatorId?: string | null;
  mantraId?: string | null;
  total: number;
  beadImageUrl?: string | null;
}

export interface LocalMalaState {
  total: number;
  syncedTotal: number;
  accumulatorId?: string | null;
  beadImageUrl?: string | null;
}

export function emptyLocalMalaState(): LocalMalaState {
  return { total: 0, syncedTotal: 0 };
}

export function isMalaDirty(state: LocalMalaState): boolean {
  return state.total > state.syncedTotal;
}

export function beadInRound(total: number, beadsPerRound = BEADS_PER_ROUND): number {
  return total % beadsPerRound;
}

export function malaRounds(total: number, beadsPerRound = BEADS_PER_ROUND): number {
  return Math.floor(total / beadsPerRound);
}

export function localizedMantraName(mantra: Mantra, language: string): string {
  const match =
    mantra.metadata.find((m) => m.language.toLowerCase() === language.toLowerCase()) ??
    mantra.metadata.find((m) => m.language.toLowerCase() === 'en') ??
    mantra.metadata[0];
  return match?.name ?? mantra.mantra?.title ?? mantra.presetId;
}

export function mantraDisplayTitle(mantra: Mantra, language: string): string {
  const title = mantra.mantra?.title;
  if (title && title.length > 0) return title;
  return localizedMantraName(mantra, language);
}

export function mantraTransliteration(mantra: Mantra): string | null {
  return mantra.mantra?.pronunciation ?? null;
}

export function mantraScript(mantra: Mantra): string | null {
  return mantra.mantra?.text ?? null;
}
