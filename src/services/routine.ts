import { ENDPOINTS } from '@/lib/api-config';
import { http } from '@/lib/http';
import type { RoutineResponse } from '@/types/routine';
import { routineDataFromApiResponse } from '@/utils/routine-mapper';
import type { RoutineData } from '@/types/routine';
import axios from 'axios';

function extractErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return '';
  const record = data as Record<string, unknown>;
  const detail = record.detail;
  if (detail && typeof detail === 'object') {
    const message = (detail as Record<string, unknown>).message;
    if (typeof message === 'string') return message;
  }
  const message = record.message ?? record.error;
  return typeof message === 'string' ? message : '';
}

/**
 * Fetches the authenticated user's routine.
 * Returns null when no routine exists (404 or 400 "no routine"), matching Flutter.
 */
export async function fetchUserRoutine(
  skip = 0,
  limit = 20,
): Promise<RoutineData | null> {
  try {
    const { data, status } = await http.get<RoutineResponse>(ENDPOINTS.routine.user, {
      params: { skip, limit },
      validateStatus: (code) =>
        (code >= 200 && code < 300) || code === 404 || code === 400,
    });

    if (status === 404) return null;

    if (status === 400) {
      const msg = extractErrorMessage(data).toLowerCase();
      if (msg.includes('no routine')) return null;
      throw new Error(extractErrorMessage(data) || 'Failed to load routine');
    }

    return routineDataFromApiResponse(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}
