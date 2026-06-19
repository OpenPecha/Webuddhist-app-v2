import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage key registry — mirrors Flutter `StorageKeys` for cross-app continuity.
 * Secure tokens use `expo-secure-store` separately.
 */
export const StorageKeys = {
  userData: 'user_data',
  isGuestMode: 'is_guest_mode',
  onboardingPreferences: 'onboarding_preferences',
  onboardingCompleted: 'onboarding_completed',
  onboardingCompletedForUser: (userId: string) => `onboarding_completed_${userId}`,
  currentUserId: 'current_user_id',
  onboardingStep: 'onboarding_step',
  onboardingData: 'onboarding_data',
  themeMode: 'theme_mode',
  preferredLanguage: 'locale',
  fontSize: 'font_size',
  firstLaunch: 'first_launch',
  dailyReminderTime: 'daily_reminder_time',
  dailyReminderEnabled: 'daily_reminder_enabled',
  notificationMasterEnabled: 'notification_master_enabled',
  notificationRoutineEnabled: 'notification_routine_enabled',
  notificationRecitationEnabled: 'notification_recitation_enabled',
  specialPlanStartedAtPrefix: 'special_plan_started_at_',
  specialPlanDay1ShownPrefix: 'special_plan_day1_shown_',
  planStartedAtPrefix: 'plan_started_at_',
  planTotalDaysPrefix: 'plan_total_days_',
  planImmediateShownPrefix: 'plan_immediate_shown_',
  readerSecondaryEnabled: 'reader_secondary_enabled',
  profileData: 'profile_data',
  lastProfileUpdate: 'last_profile_update',
} as const;

export async function getString(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function setString(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}

export async function getBoolean(key: string): Promise<boolean | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;
  return raw === 'true';
}

export async function setBoolean(key: string, value: boolean): Promise<void> {
  await AsyncStorage.setItem(key, String(value));
}

export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
