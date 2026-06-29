export {
  configureNotificationHandler,
  ensureNotificationChannels,
  requestNotificationPermissions,
  areNotificationsEnabled,
  ROUTINE_BLOCK_CHANNEL_ID,
} from '@/lib/notifications/notification-service';

export { triggerNotificationSync } from '@/lib/notifications/sync-notifications';

export type { SyncTrigger } from '@/lib/notifications/desired-notification';
export { parseNotificationPayload } from '@/lib/notifications/notification-payload';
export type { NotificationNavPayload } from '@/lib/notifications/notification-payload';
