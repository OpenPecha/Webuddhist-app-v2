/** Extracts a human-readable message from FastAPI / axios error bodies. */
export function extractApiErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return '';

  const record = data as Record<string, unknown>;
  const detail = record.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  if (detail && typeof detail === 'object') {
    const nested = detail as Record<string, unknown>;
    const message = nested.message;
    if (typeof message === 'string') return message;
  }

  const message = record.message ?? record.error;
  return typeof message === 'string' ? message : '';
}
