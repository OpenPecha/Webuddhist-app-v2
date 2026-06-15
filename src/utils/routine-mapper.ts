import type {
  RoutineBlock,
  RoutineData,
  RoutineItem,
  RoutineResponse,
  SessionDTO,
  TimeBlockDTO,
} from '@/types/routine';
import { formatRoutineTimeFromInt } from '@/utils/routine-time';

function sessionToRoutineItem(session: SessionDTO): RoutineItem {
  return {
    id: session.source_id,
    title: session.title,
    coverImage: session.image ?? null,
    imageUrl: session.image_url ?? null,
    type: session.session_type === 'PLAN' ? 'plan' : 'recitation',
    enrolledAt: session.started_at ?? null,
    language: session.language,
    startDate: session.start_date ?? null,
  };
}

function timeBlockToRoutineBlock(block: TimeBlockDTO): RoutineBlock {
  const sessions = [...block.sessions].sort((a, b) => a.display_order - b.display_order);
  return {
    id: block.id,
    timeInt: block.time_int,
    formattedTime: formatRoutineTimeFromInt(block.time_int),
    notificationEnabled: block.notification_enabled,
    items: sessions.map(sessionToRoutineItem),
  };
}

/** Maps GET /users/me/routine response to domain model (matches Flutter mapper). */
export function routineDataFromApiResponse(response: RoutineResponse | null): RoutineData | null {
  if (!response) return null;

  const blocks = response.time_blocks
    .map(timeBlockToRoutineBlock)
    .sort((a, b) => a.timeInt - b.timeInt);

  return { apiRoutineId: response.id, blocks };
}
