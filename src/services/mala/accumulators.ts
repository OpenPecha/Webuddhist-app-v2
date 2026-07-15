import { ENDPOINTS } from '@/lib/api-config';
import { NotFoundFailure } from '@/lib/api-error';
import { http } from '@/lib/http';
import type { Mantra, MalaCount } from '@/types/mala';

const PAGE_SIZE = 100;

interface PresetMantraDto {
  id?: string;
  mantra?: string;
  title?: string | null;
  pronunciation?: string | null;
  audio_url?: string | null;
  mala_image_url?: string | null;
}

interface PresetAccumulatorDto {
  id?: string;
  target_count?: number | null;
  mala_image_url?: string | null;
  metadata?: { language?: string; name?: string; description?: string | null }[];
  mantra?: PresetMantraDto | null;
}

interface PresetsResponseDto {
  accumulators?: PresetAccumulatorDto[];
  total?: number;
}

interface AccumulatorDto {
  id?: string;
  parent_id?: string | null;
  mantra_id?: string | null;
  current_count?: number;
  mala_image_url?: string | null;
}

interface AccumulatorDetailDto {
  accumulator_id?: string | null;
  parent_id?: string | null;
  current_count?: number;
  total_counted?: number;
  mala_image_url?: string | null;
}

function mapPreset(dto: PresetAccumulatorDto): Mantra {
  const mantraDto = dto.mantra;
  return {
    presetId: dto.id ?? '',
    targetCount: dto.target_count ?? null,
    beadImageUrl: mantraDto?.mala_image_url ?? dto.mala_image_url ?? null,
    metadata: (dto.metadata ?? []).map((m) => ({
      language: m.language ?? '',
      name: m.name ?? '',
      description: m.description ?? null,
    })),
    mantra: mantraDto
      ? {
          id: mantraDto.id ?? '',
          text: mantraDto.mantra ?? '',
          title: mantraDto.title ?? null,
          pronunciation: mantraDto.pronunciation ?? null,
          audioUrl: mantraDto.audio_url ?? null,
          beadImageUrl: mantraDto.mala_image_url ?? null,
        }
      : null,
  };
}

function mapAccumulator(dto: AccumulatorDto): MalaCount {
  return {
    accumulatorId: dto.id ?? null,
    mantraId: dto.mantra_id ?? null,
    total: dto.current_count ?? 0,
    beadImageUrl: dto.mala_image_url ?? null,
  };
}

function mapDetail(dto: AccumulatorDetailDto): MalaCount {
  return {
    accumulatorId: dto.accumulator_id ?? null,
    total: dto.current_count ?? 0,
    beadImageUrl: dto.mala_image_url ?? null,
  };
}

export async function fetchMalaPresets(language?: string): Promise<Mantra[]> {
  const all: Mantra[] = [];
  let skip = 0;

  while (true) {
    const { data } = await http.get<PresetsResponseDto>(ENDPOINTS.accumulators.presets, {
      params: {
        skip,
        limit: PAGE_SIZE,
        ...(language ? { language } : {}),
      },
      headers: { 'Cache-Control': 'no-cache' },
    });

    const page = (data.accumulators ?? []).map(mapPreset);
    all.push(...page.filter((m) => m.presetId.length > 0));

    const total = data.total ?? all.length;
    skip += PAGE_SIZE;
    if (page.length < PAGE_SIZE || all.length >= total) break;
  }

  return all;
}

export async function fetchAccumulatorDetail(parentId: string): Promise<MalaCount | null> {
  try {
    const { data } = await http.get<AccumulatorDetailDto>(ENDPOINTS.accumulators.detail(parentId));
    return mapDetail(data);
  } catch (error) {
    if (error instanceof NotFoundFailure) return null;
    throw error;
  }
}

export async function createUserAccumulator(parentId: string): Promise<MalaCount> {
  const { data } = await http.post<AccumulatorDto>(ENDPOINTS.accumulators.createUser, {
    parent_id: parentId,
  });
  return mapAccumulator(data);
}

export async function updateUserAccumulator(
  accumulatorId: string,
  currentCount: number,
): Promise<MalaCount> {
  const { data } = await http.put<AccumulatorDto>(
    ENDPOINTS.accumulators.updateUser(accumulatorId),
    { current_count: currentCount },
  );
  return mapAccumulator(data);
}

export async function deleteUserAccumulator(accumulatorId: string): Promise<void> {
  await http.delete(ENDPOINTS.accumulators.deleteUser(accumulatorId));
}
